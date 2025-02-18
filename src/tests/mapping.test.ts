import request from 'supertest';
import { Express } from 'express';
import path from 'path';
import fs from 'fs';
import app from '../app'
import MappingModel from '../models/mapping.model';
import csvQueue from '../bull';
// import UploadService from '../services/upload.services';
import mongoose from 'mongoose';

describe('Mapping API Endpoints', () => {
  let testApp: Express;
  beforeAll(async () => {
    testApp = app;
    
   });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await MappingModel.deleteMany({});
  });

  describe('POST /save-mapping', () => {
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
        .post('/save-mapping')
        .send(mappingData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({});
      expect(response.body).toHaveProperty('name', mappingData.name);
    });
  });



  // describe('POST /api/mapping/process', () => {
  //   it('should process CSV file with mapping', async () => {
     
  //     const mappingData = {
  //       name: "test-mapping",
  //       mappings: [{
  //         originalField: "header1",
  //         desiredName: "brand",
  //         desiredType: "string"
  //       }]
  //     };

  //     // Mock Mapping
  //     await MappingModel.create(mappingData);
      
  //     const testFilePath = path.join(__dirname, '../fixtures/test.csv');
  //     const writeStream = fs.createWriteStream(testFilePath);

  //     writeStream.write('header1,header2\nvalue1,value2');
  //     writeStream.end();
      
  //     const mock = await request(testApp).post('/upload').attach('file', testFilePath);
       
  //     const response = await request(testApp)
  //       .post('/process')
  //       .send({
  //           fileName: mock.body.fileName,
  //           mappingName: 'test-mapping'
  //         });

  //     expect(response.status).toBe(200);      
  //     expect(response.body).toHaveProperty('data');
  //     expect(response.body).toHaveProperty('totalRecords');
  //   });
  // });
});