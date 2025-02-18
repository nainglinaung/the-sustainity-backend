import { Request, Response } from "express";
import log from "../utils/log";
import { existsSync } from 'fs';
import path from 'path';
import {  ProcessRequest,SaveMappingRequest } from "../types";
import MappingModel from "../models/mapping.model";
import { ValidationError } from "../types";
import csvQueue from "../bull";
const MappingService = {

    saveMapping: async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body as SaveMappingRequest;
            const newMappingModel = new MappingModel(data);
            await newMappingModel.save();
            res.json(newMappingModel);
        } catch (error) {
            log.error({ err: error }, 'Mapping error occurred');
            res.status(500).json({ error: 'Failed to save mapping' });
        }
    },  

    
    process: async (req: Request, res: Response): Promise<void> => {
        
        try {
            const { fileName, mappingName } = req.body as ProcessRequest;
            const errors: ValidationError[] = [];
        
            if (!fileName || !mappingName) 
                throw new Error('Missing required parameters');
            

            const mappingData = await MappingModel.findOne({ name: mappingName }).lean();
        
            if (!mappingData) 
                throw new Error('Mapping not found');
            
            
            const filePath = path.join(__dirname, '../../uploads', fileName);

            if (!existsSync(filePath)) 
                throw new Error('File not found');
            

            const job = await csvQueue.add({
                fileName,
                mappingName,
                mappingData,
            });
         
            res.json({
              jobId: job.id,
              message: 'Processing job added to queue'});

        } catch (error) {
            console.log(error);
            log.error({ err: error }, 'Processing error occurred');
            res.status(500).json({ error});
        }
  }
};

export default MappingService;