interface MappingDefinition {
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
  
