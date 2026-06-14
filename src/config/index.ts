import { env } from "process";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const config = {
  database_url: env.DATABASE_URL as string,
  port: env.PORT as string,
  secret: env.JWT_SECRET as string,
  jwt_expires_in: env.JWT_EXPIRES_IN as string || '7d',
  bcrypt_salt_rounds: parseInt(env.BCRYPT_SALT_ROUNDS || '10', 10),
  node_env: env.NODE_ENV as string || 'development',
};