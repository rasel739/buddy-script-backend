import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || '10',
  jwt: {
    secret: process.env.JWT_SECRET || 'd760c0868d0fb14ca0ba0878b0f85722',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
};
