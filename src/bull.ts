import Queue from 'bull';
import { JobData } from './types';
import { processCsvFile } from './services/csv.processor';

const csvQueue = new Queue<JobData>('csv-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

csvQueue.process(async (job) => {
  return await processCsvFile(job.data);
});

export default csvQueue;