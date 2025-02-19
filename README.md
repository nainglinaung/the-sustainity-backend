# CSV Data Processing Service

A TypeScript Node.js application for processing and analyzing CSV data files.

## Features

- File upload with support for CSV files
- Data preview functionality
- Custom data mapping configuration
- Bulk data processing using Bull queue
- MongoDB integration for data persistence
- RESTful API endpoints
- Logging with Bunyan
- Docker containerization

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Redis (for Bull queue)
- Docker and Docker Compose (for containerized setup)

## Setup Instructions

### Local Development

1. Clone the repository
2. Install Required binaries for MongoDB and Redis and make sure it up and running
3. Setting Environment variables in .env

```bash
MONGODB_URI=mongodb://admin:password@mongodb:27017/file-upload?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
```

4. Install packages 

```bash
npm i
```

5. starting the development environment

```bash
npm run dev
```

### Docker Setup 

```bash
docker compose up 
```


### Running the app

/POST 


