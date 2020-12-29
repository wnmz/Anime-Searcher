const config = require('./config.js')

const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./app.js', {
  token: config.token,
  shardCount: 'auto' ,
  messageCacheMaxSize: 1,
  messageCacheLifetime: 30,
  messageSweepInterval: 60,
  disabledEvents: [
       'GUILD_CREATE'
      ,'GUILD_DELETE'
      ,'GUILD_UPDATE'
      ,'GUILD_MEMBER_ADD'
      ,'GUILD_MEMBER_REMOVE'
      ,'GUILD_MEMBER_UPDATE'
      ,'GUILD_MEMBERS_CHUNK'
      ,'GUILD_ROLE_CREATE'
      ,'GUILD_ROLE_DELETE'
      ,'GUILD_ROLE_UPDATE'
      ,'GUILD_BAN_ADD'
      ,'GUILD_BAN_REMOVE'
      ,'GUILD_EMOJIS_UPDATE'
      ,'GUILD_INTEGRATIONS_UPDATE'
      ,'CHANNEL_CREATE'
      ,'CHANNEL_DELETE'
      ,'CHANNEL_UPDATE'
      ,'CHANNEL_PINS_UPDATE'
      ,'MESSAGE_CREATE'
      ,'MESSAGE_DELETE'
      ,'MESSAGE_UPDATE'
      ,'MESSAGE_DELETE_BULK'
      ,'MESSAGE_REACTION_ADD'
      ,'MESSAGE_REACTION_REMOVE'
      ,'MESSAGE_REACTION_REMOVE_ALL'
      ,'USER_UPDATE'
      ,'PRESENCE_UPDATE'
      ,'TYPING_START'
      ,'VOICE_STATE_UPDATE'
      ,'VOICE_SERVER_UPDATE'
      ,'WEBHOOKS_UPDATE'
  ]
});

shard.spawn('auto', 0 , -1);

shard.on('launch', shard => console.log(`[SHARD] Shard ${shard.id}/${shard.totalShards}`));


