import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import interactions from './messageInteractions.mjs';

export const registerCommands = (clientId) => {
	try {
		const JSONCommands = Object.values(interactions)
			.map((command) => command.getSlashBuilder().toJSON());

		const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

		rest.put(Routes.applicationCommand(clientId), { body: JSONCommands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	}
	catch (e) {
		console.log(e);
	}
};