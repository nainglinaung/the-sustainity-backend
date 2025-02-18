import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { ValidationError,JobData } from '../types';
import DataModel from '../models/data.model';
import log from '../utils/log';

export async function processCsvFile(data: JobData) {
  const { fileName, mappingName, mappingData } = data;
  const errors: ValidationError[] = [];

  try {
    
    const filePath = path.join(__dirname, '../../uploads', fileName);
    if (!existsSync(filePath)) throw new Error('File not found');

    const fileContent = readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    if (records.length === 0) 
        throw new Error('No records found in the file');
    
    const csvHeaders = Object.keys(records[0]);
    const invalidFields = mappingData.mappings.filter(m => !csvHeaders.includes(m.originalField));
    
    if (invalidFields.length > 0) 
        throw new Error('Invalid field mappings');

    const transformedData = records.map((record: any, rowIndex: number) => {
        const mappedRecord: Record<string, any> = {};
        
        mappingData.mappings.forEach(({originalField, desiredName, desiredType}) => {
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
  
    await DataModel.insertMany(transformedData);

    return {
      data: transformedData,
      totalRecords: records.length,
      errors: errors.length > 0 ? errors : undefined,
      hasErrors: errors.length > 0,
      processedAt: new Date().toISOString()
    };

  } catch (error) {
    log.error({ err: error }, 'Processing error occurred');
    throw error;
  }
}