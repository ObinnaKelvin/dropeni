import mongoose from 'mongoose';
import {ENV} from './env.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log(`>> HOST: ${conn.connection.host} >> PORT:${conn.connection.port} >> DBNAME:${conn.connection.name} >> ✅ Connected to Dropeni Database Succcessfully 🚀🚀🚀 `);
    } catch (error) {
        console.error('❌❌Error connecting to Database:', error);
        process.exit(1); //exit code 1 means failure, 0 means success
    }
}