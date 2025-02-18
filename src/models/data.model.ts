import { Schema, model, Document } from 'mongoose';

// Interface for dynamic document
interface IData extends Document {
  [key: string]: any;
}

// Create a schema that allows any fields
const DataSchema = new Schema<IData>(
  {},
  {
    strict: false, // Allows fields that aren't predefined
    // timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create and export the model
const DataModel = model<IData>('data', DataSchema);

export default DataModel;