'use scrict';
const { token } = require('./config.js')
const { ShardingManager } = require("discord.js")
const shard = new ShardingManager('./app.js', {
  token,
  shardCount: 'auto',
});

shard.spawn();
shard.on('shardCreate', shard => { 
  console.log(`[SHARD] Shard ${shard.id} is ready!.`) 
});
