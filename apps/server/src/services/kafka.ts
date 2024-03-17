import { Kafka, KafkaConfig, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import "dotenv/config";
import prismaClient from "./prisma";

// ** KAFKA CONFIG ** //

const kafka = new Kafka({
  brokers: [`${process.env.KAFKA_HOST}:27401`],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME || "name",
    password: process.env.KAFKA_PWD || "pwd",
    mechanism: "plain",
  },
});

// ** KAFKA PRODUCER ** //

let producer: Producer | null = null;

export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  producer.send({
    messages: [
      {
        key: `message-${Date.now()}`,
        value: message,
      },
    ],
    topic: "MESSAGES",
  });
  return true;
}

// ** KAFKA CONSUMER ** //

export async function startMessageConsumer() {
  const consumer = kafka.consumer({
    groupId: "default",
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: "MESSAGES",
    fromBeginning: true
  });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`New message recieved...`);
      try {
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (err) {
        console.log("Something is wrong...");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
