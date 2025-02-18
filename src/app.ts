import express from "express";
import multer from "multer";
import path from "path";
import UploadService from "./services/upload.services";
import MappingService from "./services/mapping.services";
import DataService from "./services/data.services";

// Multer configuration
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

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.post("/upload", upload.single("file"), UploadService.upload);
app.post('/save-mapping', MappingService.saveMapping);
app.post("/process", MappingService.process);
app.get('/preview/:fileName', UploadService.preview);
app.get('/data', DataService.getAll);
app.get('/data/:id', DataService.getOne);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;