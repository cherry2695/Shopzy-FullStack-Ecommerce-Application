import { Response } from 'express';
import { Cart, Order, Coupon } from '../models/Order';
import { Address } from '../models/User';

export async function getCheckout(req: any, res: Response) {
  const userId = req.user.id || req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart?error=Your+cart+is+empty!');
    }

    const addresses = await Address.find({ user: userId });

    // Calculate checkout summaries
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const couponCode = req.session?.couponCode || '';
    let discountAmount = 0;

    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (dbCoupon && subtotal >= dbCoupon.minPurchaseAmount) {
        if (dbCoupon.discountType === 'percentage') {
          discountAmount = subtotal * (dbCoupon.discountValue / 100);
        } else {
          discountAmount = dbCoupon.discountValue;
        }
      }
    }

    const shipping = subtotal > 1500 ? 0 : 150;
    const tax = Math.round((subtotal - discountAmount) * 0.18);
    const total = subtotal - discountAmount + shipping + tax;

    res.render('checkout', {
      title: 'Secure Checkout - Shopzy',
      cart,
      addresses,
      pricing: {
        subtotal,
        discount: Math.round(discountAmount),
        shipping,
        tax,
        total
      },
      couponCode
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Checkout Error', message: err.message });
  }
}

export async function processCheckout(req: any, res: Response) {
  const userId = req.user.id || req.user._id;
  const { addressId, deliveryOption, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart?error=Cart+is+empty');
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.redirect('/checkout?error=Please+select+or+add+a+shipping+address');
    }

    // Recalculate prices
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const couponCode = req.session?.couponCode || '';
    let discountAmount = 0;

    if (couponCode) {
      const dbCoupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (dbCoupon && subtotal >= dbCoupon.minPurchaseAmount) {
        if (dbCoupon.discountType === 'percentage') {
          discountAmount = subtotal * (dbCoupon.discountValue / 100);
        } else {
          discountAmount = dbCoupon.discountValue;
        }
      }
    }

    const shipping = subtotal > 1500 ? 0 : 150;
    const tax = Math.round((subtotal - discountAmount) * 0.18);
    const total = subtotal - discountAmount + shipping + tax;

    // Generate unique human readable order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SZ-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await Order.create({
      user: userId,
      orderId,
      items: cart.items,
      shippingAddress: {
        fullName: address.fullName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        phone: address.phone
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      pricing: {
        subtotal,
        discount: Math.round(discountAmount),
        shipping,
        tax,
        total
      },
      orderStatus: 'Pending',
      couponCode,
      deliveryOption
    });

    // Clear active card coupon session
    if (req.session) {
      req.session.couponCode = null;
    }

    // Drain the Cart!
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // Routing based on Payment Gateway Choice!
    if (paymentMethod === 'COD') {
      res.redirect(`/checkout/confirmation?orderId=${orderId}`);
    } else {
      res.redirect(`/checkout/payment-gateway/${orderId}`);
    }
  } catch (err: any) {
    res.redirect('/checkout?error=' + encodeURIComponent(err.message));
  }
}

// Simulated Professional Multi-Gateway & QR Terminal View
export async function getPaymentGateway(req: any, res: Response) {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).render('error', { title: 'Order Expired', message: 'The payment transaction could not be loaded.' });
    }

    res.render('payment-gateway', {
      title: `Secured Payment Portal - Order ${orderId}`,
      order
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Gateway Error', message: err.message });
  }
}

export async function processPaymentSimulation(req: any, res: Response) {
  const { orderId } = req.params;
  const { status, txId } = req.body; // 'success' or 'fail'

  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.redirect('/cart');

    if (status === 'success') {
      await Order.findOneAndUpdate({ orderId }, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        paymentTransactionId: txId || `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      });
      res.redirect(`/checkout/confirmation?orderId=${orderId}`);
    } else {
      await Order.findOneAndUpdate({ orderId }, {
        paymentStatus: 'Failed',
        orderStatus: 'Pending'
      });
      res.redirect(`/checkout/payment-gateway/${orderId}?error=Payment+authorization+declined.+Please+retry.`);
    }
  } catch (err: any) {
    res.redirect(`/checkout/payment-gateway/${orderId}?error=` + encodeURIComponent(err.message));
  }
}

export async function getConfirmation(req: any, res: Response) {
  const { orderId } = req.query;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.redirect('/');
    }

    res.render('confirmation', {
      title: 'Order Confirmed! - Shopzy',
      order
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Confirmation Error', message: err.message });
  }
}

// User Dashboard Orders History
export async function getOrderHistory(req: any, res: Response) {
  const userId = req.user.id || req.user._id;

  try {
    const orders = await Order.find({ user: userId });
    // Sort descending by date
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.render('orders', {
      title: 'Order History - Shopzy',
      orders
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'History Indexing Error', message: err.message });
  }
}

// Real-Time Delivery Stepper Status Tracker
export async function getOrderTracker(req: any, res: Response) {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).render('error', { title: 'Order Tracking Failed', message: 'Tracking code is invalid/expired.' });
    }

    res.render('track-order', {
      title: `Track Order #${orderId} - Shopzy`,
      order
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Tracking Error', message: err.message });
  }
}

export async function cancelOrder(req: any, res: Response) {
  const { orderId } = req.params;
  const userId = req.user.id || req.user._id;

  try {
    const order = await Order.findOne({ orderId });
    if (!order || String(order.user) !== String(userId)) {
      return res.redirect('/orders?error=Action+unauthorized');
    }

    if (['Shipped', 'Out For Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.redirect(`/orders?error=Order+cannot+be+cancelled+as+it+is+already+${order.orderStatus}`);
    }

    await Order.findOneAndUpdate({ orderId }, { orderStatus: 'Cancelled' });
    res.redirect(`/orders?success=Order+cancelled+successfully`);
  } catch (err: any) {
    res.redirect('/orders?error=' + encodeURIComponent(err.message));
  }
}
