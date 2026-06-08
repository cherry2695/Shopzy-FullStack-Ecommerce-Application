import mongoose, { Schema, Document, Model } from 'mongoose';
import { isMongoActive } from '../config/db';
import { MockModel } from './dbFallback';

export function createModelWrapper<T extends { id?: string; _id?: string }>(
  modelName: string,
  schemaDefinition: any,
  schemaOptions: mongoose.SchemaOptions = {}
): any {
  // Let's create the real mongoose schema if mongoose is used
  let realModel: Model<any> | null = null;
  const mockModelInstance = new MockModel<T>(modelName);

  const getTarget = () => {
    if (isMongoActive()) {
      if (!realModel) {
        let schema: Schema;
        // Avoid duplicate compile errors in mongoose
        try {
          schema = new Schema(schemaDefinition, {
            timestamps: true,
            ...schemaOptions,
          });
          realModel = mongoose.model(modelName, schema);
        } catch {
          realModel = mongoose.model(modelName);
        }
      }
      return realModel;
    }
    return mockModelInstance;
  };

  // We return a Proxy that intercepts standard Mongoose model operations and routes them to either target
  return new Proxy({}, {
    get(target, prop, receiver) {
      const activeTarget = getTarget();
      const value = Reflect.get(activeTarget, prop);

      // Bind functions to their outer instance
      if (typeof value === 'function') {
        return value.bind(activeTarget);
      }
      return value;
    }
  }) as any;
}
