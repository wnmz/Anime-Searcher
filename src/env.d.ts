export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: string;
      DB_USER: string;

      ENV: 'dev' | 'prod';

      DISCORD_BOT_TOKEN: string;
      DISCORD_BOT_CLIENT_ID: string;

      TRACE_MOE_API_KEY?: string;
      SAUCE_NAO_API_KEY?: string;

      MONGODB_URI: string;
    }
  }
}
