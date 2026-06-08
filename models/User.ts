import mongoose from 'mongoose';
import { createModelWrapper } from '../utils/modelFactory';

// ADDRESS SCHEMA Def
export const AddressSchemaDef = {
  user: { type: String, required: true }, // Refers to User ID
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
};

// USER SCHEMA Def
export const UserSchemaDef = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  phone: { type: String }
};

export const User = createModelWrapper('User', UserSchemaDef);
export const Address = createModelWrapper('Address', AddressSchemaDef);
