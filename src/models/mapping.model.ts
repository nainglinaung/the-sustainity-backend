import { Schema, model, Document } from 'mongoose';
import { IMapping, IMappingDocument } from '../types';

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
    enum: ['string', 'number'], 
  },
});

// Main mapping schema
const MappingSchema = new Schema<IMappingDocument>({
    name: {
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
  timestamps: true, 
});

const MappingModel = model<IMappingDocument>('Mapping', MappingSchema);

export default MappingModel;