import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private conn?: ChannelModel; // ✅ bukan Connection
  private ch?: Channel;
  private queueName: string;
  private ready?: Promise<void>;

  constructor(private config: ConfigService) {
    this.queueName =
      this.config.get<string>('RABBITMQ_QUEUE') || 'message.created';
  }

  async onModuleInit() {
    this.ready = this.connectWithRetry();
    await this.ready;
  }

  private async connectWithRetry() {
    const url = this.config.get<string>('RABBITMQ_URL');
    if (!url) throw new Error('RABBITMQ_URL is not set');

    for (let attempt = 1; attempt <= 20; attempt++) {
      try {
        this.conn = await amqp.connect(url); // ✅ return ChannelModel
        this.ch = await this.conn.createChannel(); // ✅ createChannel ada di ChannelModel
        await this.ch.assertQueue(this.queueName, { durable: true });

        console.log(`[RabbitMQ] Connected. Queue=${this.queueName}`);
        return;
      } catch (err: any) {
        console.error(
          `[RabbitMQ] connect attempt ${attempt} failed:`,
          err?.message || err,
        );
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    throw new Error('RabbitMQ connection failed after retries');
  }

  private async ensureReady() {
    if (!this.ready) this.ready = this.connectWithRetry();
    await this.ready;
    if (!this.ch) throw new Error('RabbitMQ channel not ready');
  }

  async publishMessageCreated(payload: any) {
    await this.ensureReady();
    const body = Buffer.from(JSON.stringify(payload));
    this.ch!.sendToQueue(this.queueName, body, { persistent: true });
  }

  async consumeMessageCreated(handler: (payload: any) => Promise<void>) {
    await this.ensureReady();

    await this.ch!.consume(this.queueName, async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        await handler(payload);
        this.ch!.ack(msg);
      } catch {
        this.ch!.nack(msg, false, true); // requeue
      }
    });
  }

  async onModuleDestroy() {
    await this.ch?.close().catch(() => undefined);
    await this.conn?.close().catch(() => undefined);
  }
}
