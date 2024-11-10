const amqp = require('amqplib');

let channel;

async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Conectado a RabbitMQ');
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

async function subscribeToEvent(exchange, routingKey, handler) {
    await channel.assertExchange(exchange, 'topic', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, exchange, routingKey);
    channel.consume(q.queue, (msg) => {
      const content = JSON.parse(msg.content.toString());
      handler(content);
      channel.ack(msg);
    });
  }

function publishEvent(exchange, routingKey, message) {
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
}

module.exports = {
  connect,
  publishEvent,
  subscribeToEvent,
};
