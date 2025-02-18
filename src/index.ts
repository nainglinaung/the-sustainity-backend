// filepath: /typescript-node-project/typescript-node-project/src/index.ts

import express, { Request, Response } from "express";
import { config } from "./config";
import multer from "multer";
import path from "path";
import UploadService from "./services/upload.services";
import MappingService from "./services/mapping.services";

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

// Middleware setup
// app.use(someMiddleware);
app.post("/upload", upload.single("file"), UploadService.upload);
app.post("/process", MappingService.process);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
