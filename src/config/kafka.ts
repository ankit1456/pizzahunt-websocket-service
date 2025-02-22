import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { IMessageBroker } from "../types/broker";
import { io } from "../socket";

export class KafkaBroker implements IMessageBroker {
  private readonly consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        });

        switch (topic) {
          case "order": {
            // check for event_type
            const order = JSON.parse(message.value.toString());
            io.to(order.data.tenantId).emit("order-create", order);
            return;
          }
          default:
            console.log("doing nothing....");
        }
      },
    });
  }
}
