import WebSocket from 'ws';
import {msgSender} from '../../func/msgSender.js';

export function eventsRun(o){
  o.ws.on('open', (e) => {
    console.log(`[DD WSS] ${!o.ss.resumeUrl ? 'Opened':'Reopened'}`);
    if(!o.ss.resumeUrl) o.ws.send(JSON.stringify({...o.que, op:2}));
    else
    o.ws.send(JSON.stringify({// Перезапуск сессии
      op: 6,
      d: {
        token: o.que.d.token,
        session_id: o.ss.sessionId,
        seq: o.ss.s
      }
    }));
  });
  o.ws.on('resume', (e) => {
    console.log('[DD WSS] Resume', e);
  });
  o.ws.on('reconnect', () => {
    console.log('[DD WSS] Reconnecting');
  })
  o.ws.on('close', (e) => {
    console.log('[DD WSS] Closed! Code:', e);
    clearInterval(o.timer);
    connectDD(o);
  });
  o.ws.on('error', (e) => {
    console.log('[DD WSS] Error!', e);
  })

  o.ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);

    switch(data.op){
      case 0:
        // console.log('[DD WSS] OP 0');
        if(data.s) o.ss.s = data.s;
        // Далее идёт код для перезапуска сессии, но он не работает.
        // if(data.d){
        //   if(data.d.session_id) o.ss.sessionId = data.d.session_id;
        //   if(data.d.resume_gateway_url) o.ss.resumeUrl = data.d.resume_gateway_url;
        // }
      case 6:
        // console.log('[DD WSS] OP 6, resume');
      break;
      case 7:
        // console.log('[DD WSS] OP 7');
      break;
      case 10:
        console.log('[DD WSS] Beat started');
        o.timer = setInterval(() => {
          o.ws.send(JSON.stringify({ op: 1, d: !o.ss.s ? null : o.ss.s }));
        }, data.d.heartbeat_interval);
      break;
      case 11:
        console.log('[DD WSS] OP 11, heartbeat');
      break;
    }

    switch (data.t){
      case "MESSAGE_CREATE":
        let channelType;
        if(!o.builder.apps.cfg.DiscordWSS.guildsId.includes(data.d.guild_id)) return;
        for(let i in o.builder.apps.cfg.DiscordWSS.channelsId){
if(o.builder.apps.cfg.DiscordWSS.channelsId[i].includes(data.d.channel_id)) channelType = i;
        }
        if(!channelType) return;
        if(!o.builder.apps.cfg.DiscordWSS.authorsId.includes(data.d.author.id)) return;
        const m = {
          guildId: data.d.guild_id,
          channelId: data.d.channel_id,
          author: data.d.author,
          msg: {
            text: data.d.content,
            attachments: data.d.attachments,
            chType: channelType
          }
        };
        console.log('[DD WSS] New msg!', m);

        if(!data.d.author.bot) msgSender({app:'DiscordWSS', builder:o.builder, data:m});
        // o.ws.close()
        // o.ws.send(JSON.stringify({ op: 7, d: null }));
      break;
    }
  });
}


export function connectDD(o){
  console.log(`[DD WSS] ${!o.ss.resumeUrl ? 'Connecting...' : 'Reconnecting...'}`);
  o.ws = new WebSocket(!o.ss.resumeUrl ? 'wss://gateway.discord.gg/?v=10&encoding=json' : o.ss.resumeUrl);

  eventsRun({ws:o.ws, que:o.que, ss:o.ss, cfg:o.cfg, builder:o.builder, msg:o.msg});
}