const logs = {};
const interval = 10000;
const maxMsgsInInterval = 3;

// TODO: Make this better, looks awful.
export const isUserSpammer = (msg) => {
	const userLogs = logs[msg.author.id];
	if (!userLogs) {
		logs[msg.author.id] = {
			lastMessageTimestamp: msg.createdTimestamp,
			messageCount: 1,
		};

		return false;
	}

	userLogs.messageCount += 1;
	const timeDiff = msg.createdTimestamp - userLogs.lastMessageTimestamp;
	if (timeDiff < interval) {
		if (userLogs.messageCount != 1 && userLogs.messageCount > maxMsgsInInterval) {
			const time = ((interval - timeDiff) / 1000).toFixed(2);
			msg.channel.send({
				content: `You're sending messages too quick. Try again in: \`${time}s.\``,
				ephemeral: true,
			}).then(message => setTimeout(() => message.delete(), 10000));
			return true;
		}
	}
	else {
		delete logs[msg.author.id];
	}

	return false;
};
