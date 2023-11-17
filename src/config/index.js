export { default as swaggerConfig } from './swagger.config.js'
import { config } from 'dotenv';
config();

const { DB_URI, PORT, JWT_SECRET_KEY,
        REFRESH_TOKEN_SECRET_KEY, DEBUG,
        MULTI_THREAD_LIMIT_VIZITE, MULTI_THREAD_LIMIT_CIKIS,
        MULTI_THREAD_LIMIT_BILDIRIM, MULTI_THREAD_LIMIT_CONFIRM } = process.env

export const port = PORT || 5001;
export const jwtSecretKey = JWT_SECRET_KEY;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY;
export const dbUri = DB_URI;
export const debugNode = true;
export const prefix = '/api';
export const specs = "/docs";
export const multiThreadLimitVizite = MULTI_THREAD_LIMIT_VIZITE;
export const multiThreadLimitCikis = MULTI_THREAD_LIMIT_CIKIS;
export const multiThreadLimitBildirim = MULTI_THREAD_LIMIT_BILDIRIM;
export const multiThreadLimitConfirm = MULTI_THREAD_LIMIT_CONFIRM;