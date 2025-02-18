import request from 'supertest';
import { Express } from 'express';
import path from 'path';
import fs from 'fs';
import app from '../app';
import mongoose from 'mongoose';

describe('Upload Service Endpoints', () => {
  let testApp: Express;

  beforeAll(() => {
    testApp = app;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /upload', () => {
    it('should upload a CSV file successfully', async () => {
      const testFilePath = path.join(__dirname, '../fixtures/test.csv');
      const writeStream = fs.createWriteStream(testFilePath);
      writeStream.write('header1,header2\nvalue1,value2');
      writeStream.end();

      const response = await request(testApp)
        .post('/upload')
        .attach('file', testFilePath);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      expect(response.body).toHaveProperty('fileName');

      fs.unlinkSync(testFilePath);
    });

    it('should reject non-CSV files', async () => {
      const testFilePath = path.join(__dirname, '../fixtures/test.txt');
      const writeStream = fs.createWriteStream(testFilePath);
      writeStream.write('Some text content');
      writeStream.end();

      const response = await request(testApp)
        .post('/upload')
            .attach('file', testFilePath);  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Only CSV files are allowed');

      fs.unlinkSync(testFilePath);
    });

    it('should handle missing file upload', async () => {
      const response = await request(testApp)
        .post('/upload')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded');
    });
  });

  describe('GET /preview/:fileName', () => {
    it('should preview CSV file content', async () => {
      // Create a test CSV file in uploads directory
      const fileName = 'test-preview.csv';
      const filePath = path.join(__dirname, '../../uploads', fileName);
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write('name,age\nJohn,30\nJane,25');
      writeStream.end();

      const response = await request(testApp)
        .get(`/preview/${fileName}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('headers');
      expect(response.body.headers).toEqual(['name', 'age']);
      expect(response.body.data.length).toBeLessThanOrEqual(10);

      // Cleanup
      fs.unlinkSync(filePath);
    });

    it('should handle non-existent file', async () => {
      const response = await request(testApp)
        .get('/preview/non-existent.csv');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to preview file');
    });
  });
});