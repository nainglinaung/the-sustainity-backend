import dotenv from 'dotenv';
import path from "path";
import mongoose from 'mongoose';
import { config } from "./config";
import log from "./utils/log";
import app from './app';

dotenv.config({ path: path.join(__dirname, '../../.env') });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/file-upload')
.then(() => {
    const PORT = config.port || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    log.error('MongoDB connection error:', error);
    process.exit(1);
});