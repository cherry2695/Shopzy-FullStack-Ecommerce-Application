import mongoose from 'mongoose';
import { createModelWrapper } from '../utils/modelFactory';

export const CartSchemaDef = {
  user: { type: String, required: true, unique: true }, // User ID
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      color: { type: String },
      size: { type: String }
    }
  ]
};

export const WishlistSchemaDef = {
  user: { type: String, required: true, unique: true },
  products: [{ type: String }] // Array of Product IDs
};

export const OrderSchemaDef = {
  user: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true },
      color: { type: String },
      size: { type: String }
    }
  ],
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String
  },
  paymentMethod: { type: String, required: true, enum: ['COD', 'Razorpay', 'Stripe', 'PayPal'] },
  paymentStatus: { type: String, required: true, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentTransactionId: { type: String },
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
    default: 'Pending'
  },
  couponCode: { type: String },
  deliveryOption: { type: String, default: 'Standard' }
};

export const PaymentSchemaDef = {
  user: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Failed'], default: 'Pending' },
  transactionId: { type: String }
};

export const CouponSchemaDef = {
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
};

export const Cart = createModelWrapper('Cart', CartSchemaDef);
export const Wishlist = createModelWrapper('Wishlist', WishlistSchemaDef);
export const Order = createModelWrapper('Order', OrderSchemaDef);
export const Payment = createModelWrapper('Payment', PaymentSchemaDef);
export const Coupon = createModelWrapper('Coupon', CouponSchemaDef);
