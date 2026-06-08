import { Response } from 'express';
import { Product, Category, Review } from '../models/Product';
import { Order, Coupon } from '../models/Order';
import { User } from '../models/User';
import { Banner, ContactMessage, NewsletterSubscriber } from '../models/Marketing';
import { AiSetting } from '../models/AiSetting';

export async function getDashboard(req: any, res: Response) {
  try {
    const orders = await Order.find({});
    const products = await Product.find({});
    const customers = await User.find({ role: 'customer' });

    // 1. Core Analytics Metrics
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    // Revenue calculations (Sum of all order totals except 'Cancelled')
    const completedOrders = orders.filter((o: any) => o.orderStatus !== 'Cancelled');
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.pricing.total || 0), 0);

    // 2. Sales Over Time (Chart curves coordinates)
    const salesByDate: { [key: string]: number } = {};
    completedOrders.forEach((order: any) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesByDate[dateStr] = (salesByDate[dateStr] || 0) + (order.pricing.total || 0);
    });

    const dailySalesLabels = Object.keys(salesByDate).slice(-7); // Last 7 days
    const dailySalesData = dailySalesLabels.map(label => salesByDate[label]);

    // 3. Top selling categories (Ranked by item count in orders)
    const categorySalesCounts: { [key: string]: number } = {};
    completedOrders.forEach((o: any) => {
      o.items.forEach((item: any) => {
        // Find product to get its categoryName: since item.category might not be saved, let's map in memory
        categorySalesCounts[item.productId] = (categorySalesCounts[item.productId] || 0) + item.quantity;
      });
    });

    // Sort products by sales
    const sortedProductSales = Object.entries(categorySalesCounts)
      .map(([id, qty]) => {
        const prod = products.find((p: any) => p._id === id || p.id === id);
        return {
          title: prod ? prod.title : 'Deleted Product',
          category: prod ? prod.category : 'General',
          quantity: qty,
          revenue: qty * (prod ? Math.round(prod.price * (1 - prod.discount / 100)) : 0)
        };
      })
      .sort((a, b) => b.quantity - a.quantity);

    res.render('admin/dashboard', {
      title: 'Admin Analytics Panel - Shopzy',
      metrics: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalCustomers,
        totalProducts
      },
      chartData: {
        labels: JSON.stringify(dailySalesLabels),
        data: JSON.stringify(dailySalesData)
      },
      topProducts: sortedProductSales.slice(0, 5),
      recentOrders: orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
      activeTab: 'dashboard'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Admin Error', message: err.message });
  }
}

// ---------------- ORDER MANAGEMENT ----------------
export async function getAdminOrders(req: any, res: Response) {
  try {
    const orders = await Order.find({});
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.render('admin/orders', {
      title: 'Order Pipeline - Shopzy Admin',
      orders,
      activeTab: 'orders'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Pipeline Error', message: err.message });
  }
}

export async function updateOrderStatus(req: any, res: Response) {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  try {
    const updateObj: any = {};
    if (orderStatus) updateObj.orderStatus = orderStatus;
    if (paymentStatus) updateObj.paymentStatus = paymentStatus;

    await Order.findOneAndUpdate({ orderId }, updateObj);
    res.redirect('/admin/orders?success=Order+status+updated');
  } catch (err: any) {
    res.redirect('/admin/orders?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- PRODUCT MANAGEMENT ----------------
export async function getAdminProducts(req: any, res: Response) {
  try {
    const products = await Product.find({});
    const categories = await Category.find({});

    res.render('admin/products', {
      title: 'Inventory Catalog Manager - Shopzy Admin',
      products,
      categories,
      activeTab: 'products'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Inventory Error', message: err.message });
  }
}

export async function addAdminProduct(req: any, res: Response) {
  const { title, brand, category, description, price, discount, stock, colors, sizes, specNames, specValues, imageURLs } = req.body;

  try {
    // Parse variants arrays
    const colorsArray = colors ? colors.split(',').map((x: string) => x.trim()) : [];
    const sizesArray = sizes ? sizes.split(',').map((x: string) => x.trim()) : [];

    // Parse specs array
    const specifications: any[] = [];
    if (specNames && specValues) {
      const names = Array.isArray(specNames) ? specNames : [specNames];
      const values = Array.isArray(specValues) ? specValues : [specValues];
      for (let i = 0; i < names.length; i++) {
        if (names[i] && values[i]) {
          specifications.push({ name: names[i], value: values[i] });
        }
      }
    }

    // Parse image URLs pool
    let images: string[] = [];
    if (imageURLs) {
      images = imageURLs.split('\n').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
    }
    if (images.length === 0) {
      // Direct high quality fallback
      images = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
      ];
    }

    await Product.create({
      title,
      brand,
      category,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      stock: parseInt(stock),
      images,
      colors: colorsArray,
      sizes: sizesArray,
      specifications
    });

    res.redirect('/admin/products?success=Product+added+successfully!');
  } catch (err: any) {
    res.redirect('/admin/products?error=' + encodeURIComponent(err.message));
  }
}

export async function editAdminProduct(req: any, res: Response) {
  const { id } = req.params;
  const { title, brand, category, description, price, discount, stock, colors, sizes, specNames, specValues, imageURLs } = req.body;

  try {
    const colorsArray = colors ? colors.split(',').map((x: string) => x.trim()) : [];
    const sizesArray = sizes ? sizes.split(',').map((x: string) => x.trim()) : [];

    const specifications: any[] = [];
    if (specNames && specValues) {
      const names = Array.isArray(specNames) ? specNames : [specNames];
      const values = Array.isArray(specValues) ? specValues : [specValues];
      for (let i = 0; i < names.length; i++) {
        if (names[i] && values[i]) {
          specifications.push({ name: names[i], value: values[i] });
        }
      }
    }

    let images: string[] = [];
    if (imageURLs) {
      images = imageURLs.split('\n').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
    }

    const updateObj: any = {
      title,
      brand,
      category,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount),
      stock: parseInt(stock),
      colors: colorsArray,
      sizes: sizesArray,
      specifications
    };

    if (images.length > 0) {
      updateObj.images = images;
    }

    await Product.findByIdAndUpdate(id, updateObj);
    res.redirect('/admin/products?success=Product+updated!');
  } catch (err: any) {
    res.redirect('/admin/products?error=' + encodeURIComponent(err.message));
  }
}

export async function deleteAdminProduct(req: any, res: Response) {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.redirect('/admin/products?success=Product+deleted');
  } catch (err: any) {
    res.redirect('/admin/products?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- COUPONS MANAGEMENT ----------------
export async function getAdminCoupons(req: any, res: Response) {
  try {
    const coupons = await Coupon.find({});
    res.render('admin/coupons', {
      title: 'Coupons Manager - Shopzy Admin',
      coupons,
      activeTab: 'coupons'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Coupons Load Error', message: err.message });
  }
}

export async function addAdminCoupon(req: any, res: Response) {
  const { code, discountType, discountValue, expiryDate, minPurchaseAmount } = req.body;

  try {
    await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      expiryDate: new Date(expiryDate),
      minPurchaseAmount: parseFloat(minPurchaseAmount || 0)
    });
    res.redirect('/admin/coupons?success=Coupon+created');
  } catch (err: any) {
    res.redirect('/admin/coupons?error=' + encodeURIComponent(err.message));
  }
}

export async function deleteAdminCoupon(req: any, res: Response) {
  const { id } = req.params;
  try {
    await Coupon.findByIdAndDelete(id);
    res.redirect('/admin/coupons?success=Coupon+deleted');
  } catch (err: any) {
    res.redirect('/admin/coupons?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- BANNER SLIDERS MANAGEMENT ----------------
export async function getAdminBanners(req: any, res: Response) {
  try {
    const banners = await Banner.find({});
    res.render('admin/banners', {
      title: 'Marketing Banner Ads Manager - Shopzy Admin',
      banners,
      activeTab: 'banners'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Banners Error', message: err.message });
  }
}

export async function addAdminBanner(req: any, res: Response) {
  const { title, imageURL, link, position } = req.body;

  try {
    await Banner.create({ title, imageURL, link, position, isActive: true });
    res.redirect('/admin/banners?success=Banner+added');
  } catch (err: any) {
    res.redirect('/admin/banners?error=' + encodeURIComponent(err.message));
  }
}

export async function deleteAdminBanner(req: any, res: Response) {
  const { id } = req.params;
  try {
    await Banner.findByIdAndDelete(id);
    res.redirect('/admin/banners?success=Banner+removed');
  } catch (err: any) {
    res.redirect('/admin/banners?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- USER DIRECTORY ----------------
export async function getAdminUsers(req: any, res: Response) {
  try {
    const allUsers = await User.find({});
    res.render('admin/users', {
      title: 'User Accounts Directory - Shopzy Admin',
      allUsers,
      activeTab: 'users'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'User List Error', message: err.message });
  }
}

// ---------------- PRODUCT REVIEWS MODERATION ----------------
export async function getAdminReviews(req: any, res: Response) {
  try {
    const reviews = await Review.find({});
    res.render('admin/reviews', {
      title: 'Feedback Reviews Moderation - Shopzy Admin',
      reviews,
      activeTab: 'reviews'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Reviews Error', message: err.message });
  }
}

export async function deleteAdminReview(req: any, res: Response) {
  const { id } = req.params;
  try {
    await Review.findByIdAndDelete(id);
    res.redirect('/admin/reviews?success=Review+moderated+and+removed');
  } catch (err: any) {
    res.redirect('/admin/reviews?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- CONTACT SUPPORT MESSAGES ----------------
export async function getSupportMessages(req: any, res: Response) {
  try {
    const tickets = await ContactMessage.find({});
    res.render('admin/messages', {
      title: 'Support Tickets Desk - Shopzy Admin',
      tickets,
      activeTab: 'messages'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Support Tickets Error', message: err.message });
  }
}

export async function resolveSupportTicket(req: any, res: Response) {
  const { id } = req.params;
  try {
    await ContactMessage.findByIdAndUpdate(id, { repliedStatus: true });
    res.redirect('/admin/messages?success=Ticket+marked+resolved');
  } catch (err: any) {
    res.redirect('/admin/messages?error=' + encodeURIComponent(err.message));
  }
}

// ---------------- NEWSLETTER SUBSCRIBERS ----------------
export async function getNewsletterSubscribers(req: any, res: Response) {
  try {
    const subs = await NewsletterSubscriber.find({});
    res.render('admin/subscribers', {
      title: 'Newsletter Subscribers - Shopzy Admin',
      subs,
      activeTab: 'subscribers'
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Subscriber Directory Error', message: err.message });
  }
}

// ---------------- AI ASSISTANT CONFIGURATION ----------------
export async function getAdminAiSettings(req: any, res: Response) {
  try {
    let setting = await AiSetting.findOne({});
    if (!setting) {
      setting = await AiSetting.create({});
    }
    res.render('admin/ai-settings', {
      title: 'Shopzy AI Assistant Settings - Admin Desk',
      setting,
      activeTab: 'ai-settings',
      successMsg: req.query.success,
      errorMsg: req.query.error
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'AI Configuration View Error', message: err.message });
  }
}

export async function updateAdminAiSettings(req: any, res: Response) {
  try {
    const { welcomeMessage, suggestedQuestionsRaw, recommendationRules, faqQuestions, faqAnswers } = req.body;

    const suggestedQuestions = suggestedQuestionsRaw
      ? suggestedQuestionsRaw.split(',').map((q: string) => q.trim()).filter((q: string) => q !== '')
      : [];

    const faqs: any[] = [];
    if (faqQuestions && faqAnswers) {
      if (Array.isArray(faqQuestions)) {
        for (let i = 0; i < faqQuestions.length; i++) {
          if (faqQuestions[i] && faqQuestions[i].trim() !== '') {
            faqs.push({
              question: faqQuestions[i].trim(),
              answer: faqAnswers[i] ? faqAnswers[i].trim() : ''
            });
          }
        }
      } else if (faqQuestions.trim() !== '') {
        faqs.push({
          question: faqQuestions.trim(),
          answer: faqAnswers.trim()
        });
      }
    }

    let setting = await AiSetting.findOne({});
    if (!setting) {
      await AiSetting.create({
        welcomeMessage,
        suggestedQuestions,
        faqs,
        recommendationRules
      });
    } else {
      await AiSetting.findOneAndUpdate({}, {
        welcomeMessage,
        suggestedQuestions,
        faqs,
        recommendationRules
      });
    }

    res.redirect('/admin/ai-settings?success=Shopzy+AI+Chatbot+parameters+synchronized+perfectly!');
  } catch (err: any) {
    res.redirect('/admin/ai-settings?error=' + encodeURIComponent(err.message));
  }
}

