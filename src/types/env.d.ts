export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number;
      DB_USER: string;

      ENV: 'dev' | 'prod';
      DISCORD_BOT_TOKEN: string;
      TRACE_MOE_API_KEY?: string;
      SAUCE_NAO_API_KEY?: string;
    }
  }
}
