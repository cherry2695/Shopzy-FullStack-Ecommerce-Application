import { Router, Request, Response } from 'express';
import { protect, authorizeAdmin } from '../middleware/auth';
import * as authCtrl from '../controllers/authController';
import * as prodCtrl from '../controllers/productController';
import * as cartCtrl from '../controllers/cartController';
import * as ordCtrl from '../controllers/orderController';
import * as admCtrl from '../controllers/adminController';
import * as aiCtrl from '../controllers/aiController';
import { Banner, ContactMessage, NewsletterSubscriber } from '../models/Marketing';
import { Product, Category } from '../models/Product';
import { Address } from '../models/User';

const router = Router();

// ==================== MARKETPLACE HOMEPAGE ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ isActive: true, position: 'hero' });
    const categories = await Category.find({});
    const products = await Product.find({});

    // Segregate deals or sliders uniquely
    const flashSale = products.filter((p: any) => p.discount >= 20).slice(0, 8);
    const todaysDeals = products.filter((p: any) => p.stock > 0).sort(() => 0.5 - Math.random()).slice(0, 8);
    const trending = products.filter((p: any) => p.rating >= 4.7).slice(0, 8);
    const newArrivals = products.slice(-8).reverse();

    res.render('index', {
      title: 'Shopzy - Premium Amazon-Style Marketplace',
      banners: banners.length > 0 ? banners : [
        { title: 'Ultimate Tech Upgrade Sale', imageURL: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80', link: '/products?category=Laptops' }
      ],
      categories,
      flashSale,
      todaysDeals,
      trending,
      newArrivals,
      successMsg: req.query.success,
      errorMsg: req.query.error
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Bootstrap Error', message: err.message });
  }
});

// ==================== AUTHENTICATION VIEWS & HANDLERS ====================
router.get('/login', (req, res) => res.render('login', { title: 'User Login - Shopzy', redirect: req.query.redirect || '', error: null, success: null }));
router.post('/login', authCtrl.handleLogin);

router.get('/register', (req, res) => res.render('register', { title: 'Create Account - Shopzy', error: null }));
router.post('/register', authCtrl.handleRegister);

router.get('/logout', authCtrl.handleLogout);

router.get('/forgot-password', (req, res) => res.render('forgot-password', { title: 'Recover Password - Shopzy', error: null, success: null, email: null }));
router.post('/forgot-password', authCtrl.handleForgot);
router.post('/reset-password', authCtrl.handleReset);

// ==================== CATALOG MANAGEMENT ====================
router.get('/products', prodCtrl.getProducts);
router.get('/products/:id', prodCtrl.getProductDetails);
router.post('/products/:id/review', protect, prodCtrl.submitReview);
router.get('/compare', prodCtrl.compareProducts);
router.get('/api/suggestions', prodCtrl.getSuggestions);
router.post('/api/ai/chat', aiCtrl.handleAiChat);

// ==================== CART OPERATIONS ====================
router.get('/cart', protect, cartCtrl.getCart);
router.post('/cart/add', protect, cartCtrl.addToCart);
router.post('/cart/update/:itemId', protect, cartCtrl.updateQuantity);
router.get('/cart/remove/:itemId', protect, cartCtrl.removeFromCart);
router.get('/cart/save-for-later/:itemId', protect, cartCtrl.saveForLater);
router.get('/cart/move-to-cart/:index', protect, cartCtrl.moveToCartFromSave);
router.post('/cart/apply-coupon', protect, cartCtrl.applyCoupon);
router.get('/cart/remove-coupon', protect, cartCtrl.removeCoupon);

// ==================== WISHLIST PIPELINE ====================
router.get('/wishlist', protect, cartCtrl.getWishlist);
router.post('/wishlist/toggle', protect, cartCtrl.toggleWishlist);

// ==================== CHECKOUT FLOW ====================
router.get('/checkout', protect, ordCtrl.getCheckout);
router.post('/checkout/order', protect, ordCtrl.processCheckout);
router.get('/checkout/payment-gateway/:orderId', protect, ordCtrl.getPaymentGateway);
router.post('/checkout/payment-gateway/:orderId/simulate', protect, ordCtrl.processPaymentSimulation);
router.get('/checkout/confirmation', protect, ordCtrl.getConfirmation);

// ==================== ORDER TRACKING ====================
router.get('/orders', protect, ordCtrl.getOrderHistory);
router.get('/orders/track/:orderId', protect, ordCtrl.getOrderTracker);
router.get('/orders/cancel/:orderId', protect, ordCtrl.cancelOrder);

// ==================== PROFILE DASHBOARDS ====================
router.get('/profile', protect, async (req: any, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id || req.user._id });
    res.render('profile', {
      title: 'Profile Command Center - Shopzy',
      addresses,
      successMsg: req.query.success || req.query.address_success || req.query.address_deleted ? 'Profile details synchronized successfully.' : null,
      errorMsg: req.query.error || req.query.address_error ? decodeURIComponent((req.query.error || req.query.address_error) as string) : null
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Settings Error', message: err.message });
  }
});
router.post('/profile/update', protect, authCtrl.updateProfile);
router.post('/profile/password', protect, authCtrl.updatePassword);
router.post('/profile/address/add', protect, authCtrl.addAddress);
router.get('/profile/address/delete/:addressId', protect, authCtrl.deleteAddress);
router.get('/profile/address/remove/:addressId', protect, authCtrl.deleteAddress);

// ==================== HELP DESK & FOOTER TRIGGERS ====================
router.get('/contact', (req, res) => res.render('contact', { title: 'Support Desk - Shopzy', success: req.query.success }));
router.get('/conditions-of-use', (req, res) => res.render('conditions-of-use', { title: 'Conditions of Use - Shopzy' }));
router.get('/privacy-notice', (req, res) => res.render('privacy-notice', { title: 'Privacy Notice - Shopzy' }));
router.get('/consumer-interest-ads', (req, res) => res.render('consumer-interest-ads', { title: 'Consumer Interest Ads - Shopzy' }));
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await ContactMessage.create({ name, email, subject, message });
    res.redirect('/contact?success=true');
  } catch {
    res.redirect('/contact?error=true');
  }
});

router.post('/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  try {
    await NewsletterSubscriber.create({ email });
    res.redirect('/?success=newsletter_subscribed');
  } catch {
    res.redirect('/?error=newsletter_failed');
  }
});

// ==================== ADMINISTRATIVE SECURE PANELS ====================
router.get('/admin', protect, authorizeAdmin, admCtrl.getDashboard);
router.get('/admin/ai-settings', protect, authorizeAdmin, admCtrl.getAdminAiSettings);
router.post('/admin/ai-settings/update', protect, authorizeAdmin, admCtrl.updateAdminAiSettings);
router.get('/admin/orders', protect, authorizeAdmin, admCtrl.getAdminOrders);
router.post('/admin/orders/update/:orderId', protect, authorizeAdmin, admCtrl.updateOrderStatus);

router.get('/admin/products', protect, authorizeAdmin, admCtrl.getAdminProducts);
router.post('/admin/products/add', protect, authorizeAdmin, admCtrl.addAdminProduct);
router.post('/admin/products/edit/:id', protect, authorizeAdmin, admCtrl.editAdminProduct);
router.get('/admin/products/delete/:id', protect, authorizeAdmin, admCtrl.deleteAdminProduct);

router.get('/admin/coupons', protect, authorizeAdmin, admCtrl.getAdminCoupons);
router.post('/admin/coupons/add', protect, authorizeAdmin, admCtrl.addAdminCoupon);
router.get('/admin/coupons/delete/:id', protect, authorizeAdmin, admCtrl.deleteAdminCoupon);

router.get('/admin/banners', protect, authorizeAdmin, admCtrl.getAdminBanners);
router.post('/admin/banners/add', protect, authorizeAdmin, admCtrl.addAdminBanner);
router.get('/admin/banners/delete/:id', protect, authorizeAdmin, admCtrl.deleteAdminBanner);

router.get('/admin/users', protect, authorizeAdmin, admCtrl.getAdminUsers);
router.get('/admin/reviews', protect, authorizeAdmin, admCtrl.getAdminReviews);
router.get('/admin/reviews/delete/:id', protect, authorizeAdmin, admCtrl.deleteAdminReview);

router.get('/admin/messages', protect, authorizeAdmin, admCtrl.getSupportMessages);
router.get('/admin/messages/resolve/:id', protect, authorizeAdmin, admCtrl.resolveSupportTicket);

router.get('/admin/subscribers', protect, authorizeAdmin, admCtrl.getNewsletterSubscribers);

export default router;
