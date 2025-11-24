import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || '10',
  allowed_origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'd760c0868d0fb14ca0ba0878b0f85722',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
};
