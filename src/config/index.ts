import dotenv from "dotenv";

dotenv.config();

export default {
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT
};