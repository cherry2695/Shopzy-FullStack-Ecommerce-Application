import { Response } from 'express';
import { Cart, Wishlist, Coupon } from '../models/Order';
import { Product } from '../models/Product';

export async function getCart(req: any, res: Response) {
  try {
    const userId = req.user.id || req.user._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Read active coupon session if applied
    const couponCode = req.session?.couponCode || '';
    let discountAmount = 0;
    let couponDetails = null;

    // Calculate Pricing
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (dbCoupon) {
        if (subtotal >= dbCoupon.minPurchaseAmount) {
          couponDetails = dbCoupon;
          if (dbCoupon.discountType === 'percentage') {
            discountAmount = subtotal * (dbCoupon.discountValue / 100);
          } else {
            discountAmount = dbCoupon.discountValue;
          }
        } else {
          // Remove from session if subtotal is too low now
          if (req.session) req.session.couponCode = null;
        }
      }
    }

    const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150; // Free shipping over Rs. 1500
    const tax = Math.round((subtotal - discountAmount) * 0.18); // 18% standard GST
    const total = Math.max(0, subtotal - discountAmount + shipping + tax);

    // Save for Later mockup list (uses storage in session to keep things compact and fast)
    const saveForLater = req.session?.saveForLater || [];

    res.render('cart', {
      title: 'Your Shopping Cart - Shopzy',
      cart,
      saveForLater,
      pricing: {
        subtotal,
        discount: Math.round(discountAmount),
        shipping,
        tax,
        total
      },
      couponCode,
      couponDetails,
      successMsg: req.query.success,
      errorMsg: req.query.error
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Cart Error', message: err.message });
  }
}

export async function addToCart(req: any, res: Response) {
  const { productId, quantity = 1, color, size } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect('/cart?error=Product+not+found');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Calculate discounted unit price
    const finalPrice = Math.round(product.price * (1 - product.discount / 100));

    // Check if item already exists in cart with same variant
    const existingIndex = cart.items.findIndex((item: any) => 
      item.productId === productId && item.color === color && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += parseInt(quantity.toString());
    } else {
      cart.items.push({
        productId,
        title: product.title,
        price: finalPrice,
        image: product.images[0],
        quantity: parseInt(quantity.toString()),
        color: color || (product.colors[0] || ''),
        size: size || (product.sizes[0] || '')
      });
    }

    await Cart.findOneAndUpdate({ user: userId }, { items: cart.items });

    res.redirect('/cart?success=Item+added+to+cart');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

export async function updateQuantity(req: any, res: Response) {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.redirect('/cart');

    const index = cart.items.findIndex((x: any) => (x._id || x.id) === itemId);
    if (index > -1) {
      cart.items[index].quantity = Math.max(1, parseInt(quantity.toString()));
      await Cart.findOneAndUpdate({ user: userId }, { items: cart.items });
    }

    res.redirect('/cart?success=Quantity+updated');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

export async function removeFromCart(req: any, res: Response) {
  const { itemId } = req.params;
  const userId = req.user.id || req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      const filtered = cart.items.filter((x: any) => (x._id || x.id) !== itemId);
      await Cart.findOneAndUpdate({ user: userId }, { items: filtered });
    }
    res.redirect('/cart?success=Item+removed');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

// Save for Later operations
export async function saveForLater(req: any, res: Response) {
  const { itemId } = req.params;
  const userId = req.user.id || req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.redirect('/cart');

    const targetItem = cart.items.find((x: any) => (x._id || x.id) === itemId);
    if (targetItem) {
      if (!req.session) req.session = {};
      if (!req.session.saveForLater) req.session.saveForLater = [];
      
      req.session.saveForLater.push(targetItem);

      // Remove from cart
      const filtered = cart.items.filter((x: any) => (x._id || x.id) !== itemId);
      await Cart.findOneAndUpdate({ user: userId }, { items: filtered });
    }

    res.redirect('/cart?success=Item+saved+for+later');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

export async function moveToCartFromSave(req: any, res: Response) {
  const { index } = req.params;
  const userId = req.user.id || req.user._id;

  try {
    const savedList = req.session?.saveForLater || [];
    const idx = parseInt(index);
    
    if (savedList[idx]) {
      const item = savedList[idx];
      let cart = await Cart.findOne({ user: userId });
      if (!cart) cart = await Cart.create({ user: userId, items: [] });

      cart.items.push(item);
      await Cart.findOneAndUpdate({ user: userId }, { items: cart.items });

      // Remove from saved list
      savedList.splice(idx, 1);
      req.session.saveForLater = savedList;
    }

    res.redirect('/cart?success=Item+moved+to+cart');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

// Coupon Validator
export async function applyCoupon(req: any, res: Response) {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.redirect('/cart?error=Invalid+coupon+code');
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.redirect('/cart?error=Coupon+has+expired');
    }

    // Set coupon in session
    if (!req.session) req.session = {};
    req.session.couponCode = coupon.code;

    res.redirect('/cart?success=Coupon+applied+successfully!');
  } catch (err: any) {
    res.redirect('/cart?error=' + encodeURIComponent(err.message));
  }
}

export function removeCoupon(req: any, res: Response) {
  if (req.session) {
    req.session.couponCode = null;
  }
  res.redirect('/cart?success=Coupon+removed');
}

// User Wishlist Management
export async function getWishlist(req: any, res: Response) {
  const userId = req.user.id || req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Expand products
    const products = [];
    for (const pId of wishlist.products) {
      const p = await Product.findById(pId);
      if (p) products.push(p);
    }

    res.render('wishlist', {
      title: 'My Wishlist - Shopzy',
      products,
      successMsg: req.query.success
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Wishlist Error', message: err.message });
  }
}

export async function toggleWishlist(req: any, res: Response) {
  const { productId } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const idx = wishlist.products.indexOf(productId);
    if (idx > -1) {
      wishlist.products.splice(idx, 1);
      await Wishlist.findOneAndUpdate({ user: userId }, { products: wishlist.products });
      res.json({ success: true, action: 'removed' });
    } else {
      wishlist.products.push(productId);
      await Wishlist.findOneAndUpdate({ user: userId }, { products: wishlist.products });
      res.json({ success: true, action: 'added' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
