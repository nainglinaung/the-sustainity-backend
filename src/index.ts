import express  from "express";
import { config } from "./config";
import multer from "multer";
import path from "path";
import UploadService from "./services/upload.services";
import MappingService from "./services/mapping.services";
import DataService from "./services/data.services";
import log from "./utils/log";
import dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config({ path: path.join(__dirname, '../../.env') });


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/file-upload')
  .then(() => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "uploads/");
        },
        filename: function (req, file, cb) {
          cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname),
          );
        },
      });
      
      const upload = multer({ storage });
      
      const app = express();
      
      app.use(express.json());
      
   
      app.post("/upload", upload.single("file"), UploadService.upload);
      app.post('/save-mapping', MappingService.saveMapping);
      app.post("/process", MappingService.process);
      app.get('/preview/:fileName', MappingService.preview);
      app.get('/data', DataService.getAll);
      app.get('/data/:id', DataService.getOne);
      
      app.get("/", (req, res) => {
        res.send("Hello, World!");
      });
      

      const PORT = config.port || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
      
  })
  .catch((error) => {
    log.error('MongoDB connection error:', error);
    process.exit(1);
});


