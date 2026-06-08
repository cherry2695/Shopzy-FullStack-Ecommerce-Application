import mongoose from 'mongoose';
import { createModelWrapper } from '../utils/modelFactory';

export const AiSettingSchemaDef = {
  welcomeMessage: { type: String, default: "Hello! I am your Shopzy AI Assistant. How can I help you discover products, compare features, optimize checkout, or track orders today?" },
  suggestedQuestions: { type: [String], default: [
    "Find Laptops",
    "Compare headphones",
    "What's in my cart?",
    "Track my order",
    "Show my wishlist",
    "Our Return Policy"
  ]},
  faqs: {
    type: [{ question: String, answer: String }],
    default: [
      { question: "What is your return policy?", answer: "We accept returns on all physical items within 30 days of delivery. The item must be in its original packaging with tags intact. Returns are completely free of charge!" },
      { question: "How long does shipping take?", answer: "Standard delivery option takes 3-5 business days (FREE on orders over Rs. 1500; otherwise Rs. 150). Express overnight delivery ships within 24 hours." },
      { question: "What payment gateways are supported?", answer: "We support COD (Cash on Delivery), Razorpay, Stripe, and PayPal for all secure transactions." },
      { question: "Is there a warranty?", answer: "All tech items and premium headphones on Shopzy include a standard 1-year brand manufacturer warranty." }
    ]
  },
  recommendationRules: { type: String, default: "If the current category is audio or headphones, recommend headphone stands, audio adapters, or dynamic cases. If the current category is laptops, recommend a wireless mouse, USB hubs, or protective sleeves." }
};

export const AiSetting = createModelWrapper('AiSetting', AiSettingSchemaDef);
