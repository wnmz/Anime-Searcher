import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import interactions from './messageInteractions.mjs';

export const registerCommands = (clientId) => {
	try {
		const JSONCommands = Object.values(interactions)
			.map((command) => command.getSlashBuilder().toJSON());

		const JSONContextMenuInteractions = Object.values(interactions)
			.filter((command) => command.getContextBuilder != undefined)
			.map((command) => command.getContextBuilder().toJSON());

		const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

		rest.put(Routes.applicationCommands(clientId), { body: [...JSONCommands, ...JSONContextMenuInteractions] })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	}
	catch (e) {
		console.log(e);
	}
};