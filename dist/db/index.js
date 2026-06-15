import dotenv from 'dotenv';
import { Pool } from 'pg';
import { config } from '../config/index.js';
import { createSchema } from './schema.js';
dotenv.config();
console.log('DATABASE_URL =', config.database_url);
// Validate bcrypt salt rounds (assignment requires between 8 and 12)
if (config.bcrypt_salt_rounds < 8 || config.bcrypt_salt_rounds > 12) {
    throw new Error('BCRYPT_SALT_ROUNDS must be between 8 and 12');
}
// Create pool with SSL for Neon compatibility
export const pool = new Pool({
    connectionString: config.database_url,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});
pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
});
// Initialize database connection and create schema
export const initDB = async () => {
    try {
        // Test connection
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        // Create schema
        await createSchema();
        console.log('Database connected successfully!');
    }
    catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};
export default pool;
//# sourceMappingURL=index.js.map