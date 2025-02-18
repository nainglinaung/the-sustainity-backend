import request from 'supertest';
import { Express } from 'express';
import path from 'path';
import app from '../app';
import MappingModel from '../models/mapping.model';
import mongoose from 'mongoose';

describe('Mapping API Endpoints', () => {
  let testApp: Express;

  beforeAll(async () => {
    testApp = app;
    // Connect to test database
    await mongoose.connect('mongodb://admin:password@localhost:27017/test-db?authSource=admin');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await MappingModel.deleteMany({});
  });

  describe('POST /api/mapping', () => {
    it('should create a new mapping', async () => {
      const mappingData = {
        name: "test-mapping",
        mappings: [{
          originalField: "Brand",
          desiredName: "brand",
          desiredType: "string"
        }]
      };

      const response = await request(testApp)
        .post('/api/mapping')
        .send(mappingData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', mappingData.name);
    });
  });

  describe('POST /api/mapping/preview', () => {
    it('should preview CSV file', async () => {
      const testFile = path.join(__dirname, '../fixtures/test.csv');
      
      const response = await request(testApp)
        .post('/api/mapping/preview')
        .send({ fileName: 'test.csv' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('headers');
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('POST /api/mapping/process', () => {
    it('should process CSV file with mapping', async () => {
      const mappingData = {
        fileName: 'test.csv',
        mappingName: 'test-mapping'
      };

      const response = await request(testApp)
        .post('/api/mapping/process')
        .send(mappingData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('totalRecords');
    });
  });
});