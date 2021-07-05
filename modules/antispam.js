const logs = {};
const interval = 10000; // MS
const maxMsgsInInterval = 3;

//TODO: Make this better, looks awful.
module.exports = {
    checkUser: (msg) => {
        let userLogs = logs[msg.author.id]
        if (userLogs) {
            userLogs.messageCount += 1;
            let timeDiff = msg.createdTimestamp - userLogs.lastMessageTimestamp;
            if (timeDiff < interval) {
                if (userLogs.messageCount != 1 && userLogs.messageCount > maxMsgsInInterval) {
                    msg.channel.send(`You're sending messages too quick. Try again in: \`${((interval - timeDiff)/1000).toFixed(2)}s.\``)
                        .then(msg => {
                            msg.delete({
                                timeout: 5000
                            })
                        })
                    return true;
                }
            } else {
                delete logs[msg.author.id];
            }
        } else {
            logs[msg.author.id] = {
                lastMessageTimestamp: msg.createdTimestamp,
                messageCount: 1,
            }
        }

        return false;
    }
}