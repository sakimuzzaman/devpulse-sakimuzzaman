import pool from "./index.js";
export const createSchema = async () => {
    try {
        // Users Table 
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(120) NOT NULL,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password    TEXT NOT NULL,
        role        VARCHAR(20) NOT NULL DEFAULT 'contributor',
        CHECK (role IN ('contributor', 'maintainer')),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Issues Table 
        await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(150) NOT NULL,
        description  TEXT NOT NULL,
        type         VARCHAR(20) NOT NULL,
        CHECK (type IN ('bug', 'feature_request')),
        status       VARCHAR(20) NOT NULL DEFAULT 'open',
        CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id  INTEGER NOT NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Database schema created successfully.');
    }
    catch (error) {
        console.error('Error creating database schema:', error);
        throw error;
    }
};
//# sourceMappingURL=schema.js.map