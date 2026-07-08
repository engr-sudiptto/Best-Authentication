import dotenv from "dotenv";

dotenv.config()

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined in the environment variables');
}

if (!process.env.JSON_WEB_SECRET) {
  throw new Error('JSON_WEB_SECRET is not defined in the environment variables')
}

const config = {
  MONGODB_URL : process.env.MONGODB_URL,
  JSON_WEB_SECRET : process.env.JSON_WEB_SECRET
};

export default config