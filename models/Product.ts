import mongoose from 'mongoose';
import { createModelWrapper } from '../utils/modelFactory';

export const CategorySchemaDef = {
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true }
};

export const BrandSchemaDef = {
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String }
};

export const ProductSchemaDef = {
  title: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // slug or name
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Discount Percentage
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 4.5 },
  images: { type: [String], required: true }, // [Main, gallery1, gallery2, gallery3, gallery4]
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  specifications: [{ name: String, value: String }]
};

export const ReviewSchemaDef = {
  user: { type: String, required: true }, // User ID
  userName: { type: String, required: true }, // Printable user name
  product: { type: String, required: true }, // Product ID
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  likes: { type: Number, default: 0 }
};

export const Category = createModelWrapper('Category', CategorySchemaDef);
export const Brand = createModelWrapper('Brand', BrandSchemaDef);
export const Product = createModelWrapper('Product', ProductSchemaDef);
export const Review = createModelWrapper('Review', ReviewSchemaDef);
