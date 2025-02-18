// filepath: /typescript-node-project/typescript-node-project/src/config/index.ts

export const config = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "database",
  },
  // Add more configuration settings as needed
};
