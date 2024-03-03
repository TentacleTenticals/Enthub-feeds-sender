import { io } from "socket.io-client";

export function ioClient(o){
  // return new Promise((res, err) => {
  var socket = io("http://localhost:3000");
  // use your socket
  socket.on("welcome", (message) => {
      // do something with the message.
  })

  return socket;

    // res({app:'[IO]', status:'success', client:client});
  // })

}