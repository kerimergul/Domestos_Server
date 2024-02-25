export { default as swaggerConfig } from './swagger.config.js'
import { config } from 'dotenv';
config();

const { DB_URI, PORT, JWT_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY, DEBUG
} = process.env

export const port = PORT || 6001;
export const jwtSecretKey = JWT_SECRET_KEY;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY;
export const dbUri = DB_URI;
export const debugNode = true;
export const prefix = '/api';
export const specs = "/docs";
