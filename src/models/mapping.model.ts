import { Schema, model, Document } from 'mongoose';

// Interface for the mapping field
interface IMapping {
  originalField: string;
  desiredName: string;
  desiredType: string;
}

// Interface for the mapping document
interface IMappingDocument extends Document {
    fileName: string;
    mappings: IMapping[];
    name: string;
}

// Schema for individual mapping
const MappingFieldSchema = new Schema<IMapping>({
  originalField: {
    type: String,
    required: true,
  },
  desiredName: {
    type: String,
    required: true,
  },
  desiredType: {
    type: String,
    required: true,
    enum: ['string', 'number'], // restrict to only these types
  },
});

// Main mapping schema
const MappingSchema = new Schema<IMappingDocument>({
    name: {
      type: String,
    required: true,
      unique: true,
  },
  fileName: {
    type: String,
    required: true,
    unique: true,
  },
  mappings: {
    type: [MappingFieldSchema],
    required: true,
    validate: [
      {
        validator: (array: IMapping[]) => array.length > 0,
        message: 'Mappings array cannot be empty',
      },
    ],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create and export the model
const MappingModel = model<IMappingDocument>('Mapping', MappingSchema);

export default MappingModel;