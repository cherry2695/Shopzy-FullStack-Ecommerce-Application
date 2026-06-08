import mongoose from 'mongoose';
import { createModelWrapper } from '../utils/modelFactory';

export const BannerSchemaDef = {
  title: { type: String, required: true },
  imageURL: { type: String, required: true },
  link: { type: String, default: '#' },
  position: { type: String, enum: ['hero', 'promo', 'sidebar'], default: 'hero' },
  isActive: { type: Boolean, default: true }
};

export const NotificationSchemaDef = {
  user: { type: String, required: true }, // User ID or 'all'
  title: { type: String, required: true },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  type: { type: String, enum: ['order', 'promo', 'alert'], default: 'order' }
};

export const ContactMessageSchemaDef = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  repliedStatus: { type: Boolean, default: false }
};

export const NewsletterSubscriberSchemaDef = {
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
};

export const Banner = createModelWrapper('Banner', BannerSchemaDef);
export const Notification = createModelWrapper('Notification', NotificationSchemaDef);
export const ContactMessage = createModelWrapper('ContactMessage', ContactMessageSchemaDef);
export const NewsletterSubscriber = createModelWrapper('NewsletterSubscriber', NewsletterSubscriberSchemaDef);
