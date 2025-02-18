interface MappingDefinition {
    originalField: string;
    desiredName: string;
    desiredType: 'string' | 'number' | 'date' | 'boolean';
}
  
export interface ProcessRequest {
    mappingName: string;
    fileName: string;
}

export interface SaveMappingRequest { 
    mappings: MappingDefinition[];
    name: string;
}


export interface ValidationError {
    row: number;
    field: string;
    error: string;
    value: string;
  }
  
