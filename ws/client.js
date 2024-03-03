import {WebSocket} from 'ws';

export function wssConnect(o){
  // return new Promise((res, err) => {
    const client = new WebSocket(!o.url ? `ws://localhost:${o.port}` : o.url);
    
    client.on('message', (msg) => {
      console.log('[WSS] Client', msg.toString());

      // res({status:'success', server:client, wss:msg});
    });
  // })
}