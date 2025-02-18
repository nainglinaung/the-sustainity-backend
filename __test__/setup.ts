import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Queue from 'bull';
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

Queue.prototype.testMode = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: 1 // Use different DB for tests
  }
};

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

jest.setTimeout(30000);