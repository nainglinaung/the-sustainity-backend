// filepath: /typescript-node-project/typescript-node-project/src/index.ts

import express,{Request,Response} from 'express';
import { config } from './config';
import multer from 'multer';
import path from 'path';

import bunyan from 'bunyan';

// Create a bunyan logger
const log = bunyan.createLogger({
    name: 'file-upload-service',
    streams: [
        {
            level: 'info',
            path: './logs/app.log'  // Make sure this directory exists
        },
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage });

const app = express();

// Middleware setup
// app.use(someMiddleware);
app.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            log.error('No file uploaded');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        log.info({
            file: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        }, 'File uploaded successfully');

        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename
        });
    } catch (error) {
        log.error({ err: error }, 'Upload error occurred');
        res.status(500).json({ error: 'Failed to upload file' });
    }
});



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = config.port || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});