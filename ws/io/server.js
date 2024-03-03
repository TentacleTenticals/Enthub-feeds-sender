import { Server } from "socket.io";
import http from 'http';
import fs from 'fs';

export function ioServer(o){
  // return new Promise((res, err) => {
  // var app = http.createServer(handler)
  var io = new Server();
  io.listen(3000);

  // app.listen(80);


  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

  return io;

    // res({app:'[IO]', status:'success', server:io});
  // })

}