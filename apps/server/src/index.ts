import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka"

async function init() {
  startMessageConsumer()
  console.log(`Consumer is running...`)
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`HTTP Server started at PORT:${PORT}`);
  });
  socketService.initListeners();
}

init();
