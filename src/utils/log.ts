import bunyan from "bunyan";

// Create a bunyan logger
const log = bunyan.createLogger({
  name: "file-upload-service",
  streams: [
    {
      level: "info",
      path: "./logs/app.log", // Make sure this directory exists
    },
    {
      level: "info",
      stream: process.stdout,
    },
  ],
});

export default log;
