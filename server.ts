import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { IMessageBroker } from "./src/types/broker";

const startServer = async () => {
  let broker: IMessageBroker | null = null;
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(["order"], false);
  } catch (err) {
    logger.error("Error happened: ", err.message);
    process.exit(1);
  }
};

void startServer();
