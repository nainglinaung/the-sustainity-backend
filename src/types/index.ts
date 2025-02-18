export interface IMapping {
    originalField: string;
    desiredName: string;
    desiredType: string;
  }
  
export   interface IMappingDocument extends Document {
      mappings: IMapping[];
      name: string;
  }
  
  

export interface MappingDefinition {
    originalField: string;
    desiredName: string;
    desiredType: 'string' | 'number' | 'date' | 'boolean';
}

export interface PreviewRequest {
    fileName: string;
}

export interface ProcessRequest {
    mappingName: string;
    fileName: string;
}

export interface JobData {
    mappingName: string;
    fileName: string;
    mappingData: Record<string, any>;
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

export interface PaginatedResponse {
    data: Record<string, any>[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
}
  



export interface ValidationError {
    row: number;
    field: string;
    error: string;
    value: string;
  }
  
