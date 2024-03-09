import { Server } from "socket.io";
import Redis from "ioredis";

const redisConfig = {
  host: "redis-1edac2c7-chat-app-1812.a.aivencloud.com",
  port: 27388,
  username: "default",
  password: "AVNS_stgDM8s4xeoXmWMJ3L1",
}

const pub = new Redis(redisConfig);

const sub = new Redis(redisConfig);

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe('Messages')
  }
  public initListeners() {
    const io = this.io;
    console.log("Init Listeners...");

    io.on("connect", async (socket) => {
      console.log("New Socket Connected: ", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message recieved: ", message);

        // publish this message to redis
        await pub.publish('Messages', JSON.stringify({
          message
        }))
      });
    });

    sub.on('message', (channel, message) => {
      if(channel === 'Messages') {
        console.log("New message from redis", message)
        io.emit("message", message)
      }
    })
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
