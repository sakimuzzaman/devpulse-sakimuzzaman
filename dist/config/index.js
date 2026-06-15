import { env } from "process";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
export const config = {
    database_url: env.DATABASE_URL,
    port: env.PORT,
    secret: env.JWT_SECRET,
    jwt_expires_in: env.JWT_EXPIRES_IN || '7d',
    bcrypt_salt_rounds: parseInt(env.BCRYPT_SALT_ROUNDS || '10', 10),
    node_env: env.NODE_ENV || 'development',
};
//# sourceMappingURL=index.js.map