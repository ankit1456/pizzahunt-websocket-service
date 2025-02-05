import config from "config";
import { KafkaBroker } from "../config/kafka";
import { IMessageBroker } from "../types/broker";

let broker: IMessageBroker | null = null;

export const createMessageBroker = (): IMessageBroker => {
  console.log("connecting to kafka broker...");

  if (!broker) {
    broker = new KafkaBroker("pizzahunt-websocket-service", [
      config.get("kafka.broker"),
    ]);
  }
  return broker;
};
