import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let useRealMongo = false;

export async function initDb(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGODB_URI environment variable detected. Running Shopzy on Local JSON Engine mode.');
    useRealMongo = false;
    return false;
  }

  try {
    // Set Mongoose connection timeout to 5 seconds to fail quickly if incorrect or offline
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB cloud database successfully.');
    useRealMongo = true;
    return true;
  } catch (err: any) {
    console.error('❌ Failed to connect to MongoDB URI. Dropping back to Local JSON Engine. Detail:', err.message);
    useRealMongo = false;
    return false;
  }
}

export function isMongoActive(): boolean {
  return useRealMongo;
}
