import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    });
  }
  public initListeners() {
    const io = this.io;
    console.log("Init Listeners...");

    io.on("connect", async (socket) => {
      console.log("New Socket Connected: ", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message recieved: ", message);
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
