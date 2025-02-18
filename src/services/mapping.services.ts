import { Request, Response } from "express";
import log from "../utils/log";
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { ProcessRequest } from "../types";
import MappingModel from "../models/mapping.model";
interface ValidationError {
  row: number;
  field: string;
  error: string;
  value: string;
}

const transform = () => {

}

const MappingService = {



  mapFieldNames: async (req: Request, res: Response): Promise<void> => {
        const data = req.body as ProcessRequest;
        const newMappingModel = new MappingModel(data);
        await newMappingModel.save();
        res.json(newMappingModel);
    },  
    
  process: (req: Request, res: Response): void => {
    try {
      const { fileName, mappings } = req.body as ProcessRequest;
      const errors: ValidationError[] = [];
      
 
      if (!fileName || !mappings) {
        log.error('Missing required parameters');
        res.status(400).json({ error: 'fileName and mappings are required' });
        return;
      }

      const filePath = path.join(__dirname, '../../uploads', fileName);

      if (!existsSync(filePath)) {
        log.error(`File not found: ${fileName}`);
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const fileContent = readFileSync(filePath, 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });


      if (records.length === 0) {
        log.error('Empty CSV file');
        res.status(400).json({ error: 'CSV file is empty' });
        return;
      }

      const csvHeaders = Object.keys(records[0]);
      const invalidFields = mappings.filter(m => !csvHeaders.includes(m.originalField));
      
      if (invalidFields.length > 0) {
        log.error('Invalid field mappings', { invalidFields });
        res.status(400).json({ 
          error: 'Invalid field mappings',
          invalidFields: invalidFields.map(f => f.originalField)
        });
        return;
      }

      const transformedData = records.map((record: any, rowIndex: number) => {
        const mappedRecord: Record<string, any> = {};
        
        mappings.forEach(({originalField, desiredName, desiredType}) => {
          const value = record[originalField]?.trim();
          
          if (value === undefined || value === '') {
            errors.push({
              row: rowIndex + 1,
              field: originalField,
              error: 'Missing value',
              value: value || ''
            });
            mappedRecord[desiredName] = null;
            return;
          }

          try {
            switch (desiredType) {
              case 'number':
                const num = Number(value);
                if (isNaN(num)) throw new Error('Invalid number format');
                mappedRecord[desiredName] = num;
                break;
              case 'date':
                const date = new Date(value);
                if (isNaN(date.getTime())) throw new Error('Invalid date format');
                mappedRecord[desiredName] = date;
                break;
              case 'boolean':
                if (!['true', 'false', '0', '1'].includes(value.toLowerCase())) {
                  throw new Error('Invalid boolean format');
                }
                mappedRecord[desiredName] = ['true', '1'].includes(value.toLowerCase());
                break;
              case 'string':
                mappedRecord[desiredName] = String(value);
                break;
              default:
                throw new Error(`Unsupported type: ${desiredType}`);
            }
          } catch (error) {
            errors.push({
              row: rowIndex + 1,
              field: originalField,
              error: error instanceof Error ? error.message : 'Unknown error',
              value: value
            });
            mappedRecord[desiredName] = null;
          }
        });

        return mappedRecord;
      });

      res.json({
        data: transformedData,
        totalRecords: records.length,
        errors: errors.length > 0 ? errors : undefined,
        hasErrors: errors.length > 0,
        processedAt: new Date().toISOString()
      });

    } catch (error) {
      log.error({ err: error }, 'Processing error occurred');
      res.status(500).json({ error: 'Failed to process file' });
    }
  }
};

export default MappingService;