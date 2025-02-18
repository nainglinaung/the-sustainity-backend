import { Request, Response } from "express";
import log from "../utils/log";
import { readFileSync,existsSync } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { ProcessRequest } from "../types";




const MappingService = {

    process: (req: Request, res: Response): void => { 
        const { fileName, mappings } = req.body as ProcessRequest;
        
        if (!fileName || !mappings) {
            log.error('Missing required parameters');
            res.status(400).json({ error: 'fileName and mappings are required' });
            return;
        }
        
        const filePath = path.join(__dirname, '../../uploads', fileName);

        if (!existsSync(filePath)) {
            log.error('File not found');
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const fileContent = readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        const transformedData = records.map((record: any) => {
            const mappedRecord: Record<string, any> = {};
            
            mappings.forEach(({originalField,desiredName,desiredType}) => {
              const value = record[originalField];
              
              if (value === undefined) {
                log.warn(`Field ${originalField} not found in CSV`);
                return;
              }
    
              try {
                switch (desiredType) {
                  case 'number':
                    mappedRecord[desiredName] = Number(value);
                    break;
                  case 'date':
                    mappedRecord[desiredName] = new Date(value);
                    break;
                  case 'boolean':
                    mappedRecord[desiredName] = value.toLowerCase() === 'true';
                    break;
                  case 'string':
                  default:
                    mappedRecord[desiredName] = String(value);
                }
              } catch (error) {
                log.error(`Error transforming field ${originalField}: ${error}`);
                mappedRecord[desiredName] = null;
              }
            });
    
            return mappedRecord;
        });
        
        res.json(transformedData);
    }

  
};


export default MappingService;