// filepath: /typescript-node-project/typescript-node-project/src/types/index.ts

// This file is intentionally left blank.

interface MappingDefinition {
    originalField: string;
    desiredName: string;
    desiredType: 'string' | 'number' | 'date' | 'boolean';
}
  
export interface ProcessRequest {
    fileName: string;
    mappings: MappingDefinition[];
}
