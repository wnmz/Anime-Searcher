import 'dotenv/config';
import { DiscordBotClient } from './bot/Client';

const client = new DiscordBotClient();

client.login(process.env.DISCORD_BOT_TOKEN);
