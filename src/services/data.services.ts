import {Request, Response} from 'express';
import DataModel from '../models/data.model';
import { PaginatedResponse } from '../types';

const DataService = {
    getAll: async (req: Request, res: Response): Promise<void> => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const skip = (page - 1) * limit;
  
        const [data, total] = await Promise.all([
          DataModel.find()
            .skip(skip)
            .limit(limit)
            .lean(),
          DataModel.countDocuments()
        ]);
  
        const response: PaginatedResponse = {
          data,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        };
  
        res.json(response);
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to fetch data',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

export default DataService;