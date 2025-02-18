import { Request, Response } from "express";
import log from "../utils/log";
import path from 'path';
import {  existsSync, createReadStream } from 'fs';
import csv from 'csv-parse'

const UploadService = {
  upload: (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        log.error("No file uploaded");
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      if (!req.file.originalname.match(/\.(csv)$/)) {
        log.error("Invalid file type, only CSV files are allowed");
        res.status(400).json({ error: "Only CSV files are allowed" });
      }

      log.info(
        {
          file: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        "File uploaded successfully",
      );

      res.json({
        message: "File uploaded successfully",
        fileName: req.file.filename,
      });
    } catch (error) {
      log.error({ err: error }, "Upload error occurred");
      res.status(500).json({ error: "Failed to upload file" });
    }
  },

  
  preview: async (req: Request, res: Response): Promise<void> => { 
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '../../uploads', fileName);

        if (!existsSync(filePath)) 
            throw new Error('File not found');
        

        const records: any[] = [];
        let headers: string[] = [];
        let totalRows = 0;

        const parser = createReadStream(filePath)
            .pipe(csv.parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            }));

        for await (const record of parser) {
            totalRows++;
            
            if (totalRows === 1) {
                headers = Object.keys(record);
            }

            if (records.length < 10) {
                records.push(record);
            } else {
                parser.destroy();
                break;
            }
        }

        res.json({
            data: records,
            previewCount: records.length,
            headers,
            message: 'Preview of first 10 records'
        });

    } catch (error) {
        log.error({ err: error }, 'Preview error occurred');
        res.status(500).json({ 
            error: 'Failed to preview file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
},
};

export default UploadService;
