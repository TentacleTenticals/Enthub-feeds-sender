import {WebSocketServer, WebSocket} from 'ws';
// console.log(WebSocket.prototype)
WebSocket.prototype.emit = function(e, data){
  console.log('EMIT', {event:e});
  if(e === 'new') this.send(e, data)
  // if(e === 'message') this.send(JSON.stringify({e, data}));
}

export function wssServer(o){
  console.log('[WSS] Server...');
  // const WS = {};
  // console.log(WebSocketServer());

  return new Promise((res, err) => {
    const server = new WebSocketServer({port: o.port});
    
    server.on('connection', (ws) => {
      console.log('[WSS] Connection');

      ws.on('open', (e) => {
        console.log('[WSS] Open', e);
      })

      ws.on('error', (err) => {
        console.log('[WSS] Error', err);
      });
      ws.on('message', (msg) => {
        console.log('[WSS] a', msg);

        // wss.emit('newFeed', {wss:'q', err:'e'});

        server.clients.forEach((c) => {
          console.log('qqqq')
          if(c.readyState === WebSocket.OPEN) {
            // c.send(msg);

            const w = {
              eventName:"newFeed",
              data:msg};

            // wss.emit(JSON.parse(w));
          }
        });
      });

      // ws.on('new', e => {
      //   console.log('NNN', e)
      //   server.emit('new', 'qe')
      // })

      // WS.s = ws;

      // ws.send('newFeed', {wo:'x'})

      // console.log(server.emit())

      ws.emit('new', 'w');

      // ws.send('q')

      // ws.send('newFeed', {data:'ao'})

      res({status:'success', server:server, wss:ws});

      // res({status:'success', server:WS.server, wss:WS.ws});
    });

    const client = new WebSocket(!o.url ? `ws://localhost:${o.port}` : o.url);

    client.on('message', (msg) => {
      console.log('[WSS] MSG', msg.toString());
    });

    client.on('new', (msg) => {
      console.log('[WSS] New Feed', msg);
    });

    //   ws.on('newFeed', e => {
    //     console.log('[FEED]', e);
    //   })

    //   // WS.c = ws;

    //   // res({status:'success', server:WS.server, wss:WS.s, ws:WS.c});

    //   // res({status:'success', server:client, wss:ws});
    // });

    // res({status:'success', server:WS.server, wss:WS.s, ws:WS.c});
  })
};