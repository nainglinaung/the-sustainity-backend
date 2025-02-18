import { Request, Response } from "express";
import log from "../utils/log";
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
        filename: req.file.filename,
      });
    } catch (error) {
      log.error({ err: error }, "Upload error occurred");
      res.status(500).json({ error: "Failed to upload file" });
    }
  },
};

export default UploadService;
