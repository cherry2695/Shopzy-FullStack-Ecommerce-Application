import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Product, Category, Brand } from '../models/Product';
import { Cart, Wishlist, Order } from '../models/Order';
import { AiSetting } from '../models/AiSetting';

// Initialize the modern @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

/**
 * Handle AI Assistant conversations with high-context awareness, mapping FAQs,
 * catalog searching, and direct database database side-effects.
 */
export async function handleAiChat(req: any, res: Response) {
  try {
    const { message, history = [], currentPath = '/' } = req.body;
    const userId = req.user?.id || req.user?._id;

    // Load AI configurations from Admin Settings
    let aiConfig = await AiSetting.findOne({});
    if (!aiConfig) {
      aiConfig = await AiSetting.create({});
    }

    // Accumulate user contextual states
    let userCart = null;
    let userWishlist = null;
    let userOrders = [];

    if (userId) {
      userCart = await Cart.findOne({ user: userId });
      userWishlist = await Wishlist.findOne({ user: userId });
      userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    // 1. Fetch available Category and Brand taxonomies
    const categoriesList = await Category.find({});
    const brandsList = await Brand.find({});

    const taxonomyContext = {
      categories: categoriesList.map(c => ({ name: c.name, slug: c.slug })),
      brands: brandsList.map(b => b.name)
    };

    // 2. Identify context matches from path and dynamic message matching to retrieve targeted items
    let pathMatchedCategories: string[] = [];
    let pathMatchedBrands: string[] = [];

    if (currentPath) {
      try {
        const urlObj = new URL(currentPath, 'http://localhost');
        const catParam = urlObj.searchParams.get('category');
        const brandParam = urlObj.searchParams.get('brand');
        if (catParam) {
          const bestCat = categoriesList.find(c => c.name.toLowerCase() === catParam.toLowerCase() || c.slug.toLowerCase() === catParam.toLowerCase());
          if (bestCat) pathMatchedCategories.push(bestCat.name);
          else pathMatchedCategories.push(catParam);
        }
        if (brandParam) {
          const bestBrand = brandsList.find(b => b.name.toLowerCase() === brandParam.toLowerCase() || b.slug.toLowerCase() === brandParam.toLowerCase());
          if (bestBrand) pathMatchedBrands.push(bestBrand.name);
          else pathMatchedBrands.push(brandParam);
        }
      } catch (err) {
        // Safe check
      }
    }

    const lowerMessage = message.toLowerCase();
    const queryMatchedCategories: string[] = [];
    const queryMatchedBrands: string[] = [];

    for (const cat of categoriesList) {
      if (lowerMessage.includes(cat.name.toLowerCase()) || lowerMessage.includes(cat.slug.toLowerCase())) {
        queryMatchedCategories.push(cat.name);
      }
    }

    for (const br of brandsList) {
      if (lowerMessage.includes(br.name.toLowerCase()) || lowerMessage.includes(br.slug.toLowerCase())) {
        queryMatchedBrands.push(br.name);
      }
    }

    const matchedCategories = Array.from(new Set([...pathMatchedCategories, ...queryMatchedCategories]));
    const matchedBrands = Array.from(new Set([...pathMatchedBrands, ...queryMatchedBrands]));

    // 3. Compile a highly precise DB product query to optimize token count & response speed
    let productQuery: any = {};
    if (matchedCategories.length > 0 && matchedBrands.length > 0) {
      productQuery = {
        category: { $in: matchedCategories },
        brand: { $in: matchedBrands }
      };
    } else if (matchedCategories.length > 0) {
      productQuery = { category: { $in: matchedCategories } };
    } else if (matchedBrands.length > 0) {
      productQuery = { brand: { $in: matchedBrands } };
    } else {
      // General token searching for specific catalog match terms
      const searchWords = lowerMessage
        .split(/\s+/)
        .map(w => w.replace(/[^a-zA-Z0-9-]/g, ''))
        .filter(w => w.length > 2 && !['what', 'with', 'this', 'that', 'your', 'about', 'would', 'could', 'should', 'from', 'have', 'some', 'than', 'them', 'they', 'want', 'show', 'find', 'view', 'cart', 'wishlist', 'order', 'please', 'help', 'more', 'less', 'good', 'cheap', 'best', 'policy', 'return', 'delivery', 'coupon', 'code', 'discount'].includes(w));

      if (searchWords.length > 0) {
        const regexes = searchWords.map(word => new RegExp(word, 'i'));
        productQuery = {
          $or: [
            { title: { $in: regexes } }
          ]
        };
      }
    }

    // Load products matching identified topics (limit to 24 items to guarantee sub-second prompt performance)
    let rawProducts = await Product.find(productQuery).limit(24);

    // Fall back to a lightweight, balanced curated set from DB if query resolved to nothing
    if (rawProducts.length === 0) {
      rawProducts = await Product.find({}).limit(14);
    }

    const productsContext = rawProducts.map(p => ({
      id: p._id || p.id,
      title: p.title,
      brand: p.brand,
      category: p.category,
      price: p.price,
      discount: p.discount,
      stock: p.stock,
      rating: p.rating
    }));

    // Structure a strong, prescriptive system prompt guiding LLM decisions
    const systemInstruction = `You are the "Shopzy Smart Shopping Assistant" on the Shopzy e-commerce marketplace.
Your goal is to act as a brilliant product guide, navigation captain, customer support agent, and shopping concierge.

WELCOME INTRO DEFAULT:
"${aiConfig.welcomeMessage}"

ADMIN PRODUCT/RECOMMENDATION RULES:
"${aiConfig.recommendationRules}"

FAQ KNOWLEDGEBASE SUPPORT ANSWERS:
${(aiConfig.faqs || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

CATALOG DIRECTORY TAXONOMY (A comprehensive registry of available Categories and Brands on Shopzy):
${JSON.stringify(taxonomyContext)}

TARGETED IN-INVENTORY CATALOG (Source of truth for currently matched topics. Highlight these if matches exist):
${JSON.stringify(productsContext)}

CURRENT USER TRANS-SESSION CONTEXT:
- Authentication State: ${userId ? 'LOGGED-IN' : 'GUEST / ANONYMOUS'}
- Customer Name: ${req.user?.name || 'Guest User'}
- Active Browser View Path: ${currentPath}
- Active DB Shopping Cart: ${userCart ? JSON.stringify((userCart.items || []).map((i: any) => ({ name: i.title, id: i.productId, price: i.price, qty: i.quantity }))) : 'No active items'}
- Active DB Saved Wishlist: ${userWishlist ? JSON.stringify(userWishlist.products || []) : 'No saved lists'}
- Historic Orders Registry: ${userId ? JSON.stringify((userOrders || []).map((o: any) => ({ orderId: o.orderId, status: o.orderStatus, totalBill: o.pricing?.total || 0, products: (o.items || []).map((i: any) => i.title) }))) : 'Not authenticated'}

COUPON RULES:
Active discount codes are:
- SHOPZY10: Provides 10% off the cart subtotal.
- FESTIVE500: Flat Rs. 500 off on bills exceeding Rs. 4999.

REQUIREMENTS FOR SECURITY AND SAFETY:
1. Sensitive user details (e.g. passwords, reset tokens) MUST never be shown or discussed.
2. Direct CRUD manipulation of orders, carts, or wishlists is ONLY permitted for logged-in users.
For guest users, tell them: "Please login to your account to view or edit your cart/wishlist!"

RESPONSE STRUCTURE SPECIFICATION:
You MUST format your output as a single, valid JSON object following this exact schema structure:
{
  "text": "Your helpful natural language markdown explanation. Be charming, direct, support voice read-outs cleanly, explain recommendations, compare items side-by-side using table layouts if requested, or guide checkout steps.",
  "command": {
    "action": "navigate" | "add_to_cart" | "remove_from_cart" | "add_to_wishlist" | "view_cart" | "view_wishlist" | "checkout_help" | "compare" | "none",
    "params": {
      "path": "URL pattern string (e.g. '/products?category=laptops' or '/compare?p1=xyz&p2=abc' or '/cart')",
      "productId": "String corresponding to the database record ID (id or _id from inventory catalog lists)",
      "quantity": 1
    }
  }
}

MATCHING PATTERNS FOR ACTION COMMANDS:
- User wants to see a category or brand: Set action to "navigate" and specify the query slug in path (e.g., '/products?category=headphones', '/products?brand=sony', '/products?maxPrice=5000').
- User wants to store/add an item into the cart: If logged-in, set action to "add_to_cart" and select matching productId. If guest, guide them to log in.
- User wants to remove an item from the cart: If logged-in, set action to "remove_from_cart" and matching productId.
- User wants to save for later/add to wishlist: If logged-in, set action to "add_to_wishlist" and matching productId.
- User wants to view cart/wishlist contents: Set action to "view_cart" or "view_wishlist".
- User wants help checking out: Set action to "checkout_help" and path to "/checkout".
- User wants to compare products: Set action to "compare" and path to "/compare?p1=id1&p2=id2".

Always double-check product inventory names and pricing rate details before answering. Remain strictly factual to the provided catalog context.`;

    // Process message history
    const contents: any[] = [];
    const safeHistory = Array.isArray(history) ? history : [];
    for (const entry of safeHistory) {
      contents.push({
        role: entry.role === 'user' ? 'user' : 'model',
        parts: [{ text: entry.text }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsedText = response.text?.trim() || '{}';
    let responseObj;
    try {
      responseObj = JSON.parse(parsedText);
    } catch {
      responseObj = {
        text: response.text || "I apologize, I could not synthesize a proper configuration. How can I help you?",
        command: { action: 'none', params: {} }
      };
    }

    // Backend proactive database side-effects to guarantee persistent action
    let persistentMessageAddition = "";
    if (userId && responseObj.command) {
      const action = responseObj.command.action;
      const pId = responseObj.command.params?.productId;

      if (action === 'add_to_cart' && pId) {
        const product = await Product.findById(pId);
        if (product) {
          let cart = await Cart.findOne({ user: userId });
          if (!cart) cart = await Cart.create({ user: userId, items: [] });

          const finalPrice = Math.round(product.price * (1 - product.discount / 100));
          const index = cart.items.findIndex((item: any) => item.productId === pId);
          if (index > -1) {
            cart.items[index].quantity += 1;
          } else {
            cart.items.push({
              productId: pId,
              title: product.title,
              price: finalPrice,
              image: product.images[0],
              quantity: 1,
              color: product.colors?.[0] || 'Default',
              size: product.sizes?.[0] || 'Standard'
            });
          }
          await Cart.findOneAndUpdate({ user: userId }, { items: cart.items });
          persistentMessageAddition = ` *(Successfully added "${product.title}" directly to your shopping cart!)*`;
        }
      } else if (action === 'remove_from_cart' && pId) {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          const originalLen = cart.items.length;
          const filtered = cart.items.filter((item: any) => item.productId !== pId);
          await Cart.findOneAndUpdate({ user: userId }, { items: filtered });
          if (filtered.length < originalLen) {
            persistentMessageAddition = ` *(Removed item from your active shopping cart)*`;
          }
        }
      } else if (action === 'add_to_wishlist' && pId) {
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          wishlist = await Wishlist.create({ user: userId, products: [] });
        }
        if (!wishlist.products.includes(pId)) {
          wishlist.products.push(pId);
          await Wishlist.findOneAndUpdate({ user: userId }, { products: wishlist.products });
          const product = await Product.findById(pId);
          persistentMessageAddition = ` *(Saved "${product?.title || 'item'}" securely to your Wishlist registry!)*`;
        }
      }
    }

    if (persistentMessageAddition) {
      responseObj.text += persistentMessageAddition;
    }

    return res.json(responseObj);

  } catch (err: any) {
    console.error('[AI CHAT CONTROLLER ERROR]:', err);
    return res.status(500).json({
      text: `Apologies, I encountered a backend processing exception: ${err.message}`,
      command: { action: 'none', params: {} }
    });
  }
}
