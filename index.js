const config = require('./config.js')

const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./app.js', {
  token: config.token,
  totalShards: 'auto', 
});

shard.spawn('auto', 0 , -1);

shard.on('launch', shard => console.log(`[SHARD] Shard ${shard.id}/${shard.totalShards}`));


