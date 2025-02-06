import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { wsServer } from "./src/socket";
import { IMessageBroker } from "./src/types/broker";
import config from "config";

const startServer = async () => {
  let broker: IMessageBroker | null = null;
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(["order"], false);

    const PORT: number = config.get("server.port");
    wsServer
      .listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
      })
      .on("error", (err) => {
        console.log("error", err.message);
        process.exit(1);
      });
  } catch (err) {
    logger.error("Error happened: ", err.message);
    if (broker) await broker.disconnectConsumer();
    process.exit(1);
  }
};

void startServer();
