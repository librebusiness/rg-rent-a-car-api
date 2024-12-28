import 'dotenv/config';

const { JWT_SECRET } = process.env;

export const jwtConstants = {
  secret: JWT_SECRET
}

export enum ProviderEnum
{
    GOOGLE = 'google',
    JWT = 'jwt'
}

export const expiresTimeTokenMilliseconds = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_NAMES = {
  JWT: 'jwt'
};


