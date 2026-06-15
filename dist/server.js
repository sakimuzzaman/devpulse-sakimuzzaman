import app from './app.js';
import { config } from './config/index.js';
import { initDB } from './db/index.js';
async function devPulse() {
    try {
        // Initialize database connection and create schema
        await initDB();
        // Start the server
        const port = parseInt(config.port, 10) || 5000;
        app.listen(port, () => {
            console.log(` DevPulse server is running on port ${port}`);
            console.log(` Environment: ${config.node_env}`);
            console.log(` Health check: http://localhost:${port}/health`);
        });
    }
    catch (error) {
        console.error(' Failed to start server:', error);
        process.exit(1);
    }
}
devPulse();
//# sourceMappingURL=server.js.map