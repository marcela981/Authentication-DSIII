const amqp = require('amqplib');

let channel;
let connection;

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://myuser:mypassword@rabbitmq');
    channel = await connection.createChannel();

    // Declarar el exchange solo una vez
    const exchange = 'authExchange';
    const exchangeType = 'topic';
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    console.log('Connected to RabbitMQ and exchange declared');
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    throw error;
  }
}

async function subscribeToEvent(exchange, routingKey, handler) {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }

    // Asegurarse de que el exchange esté declarado
    await channel.assertExchange(exchange, 'topic', { durable: true });
    const q = await channel.assertQueue('some-fixed-queue', { durable: true });  // Se elimina la opción 'exclusive'

    await channel.bindQueue(q.queue, exchange, routingKey);
    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          handler(content);
        } catch (error) {
          console.error('Error procesando el mensaje:', error);
        }
        channel.ack(msg);
      }
    });

    console.log(`Suscrito a ${routingKey} en el exchange ${exchange}`);
  } catch (error) {
    console.error('Error subscribing to event', error);
    if (error.code === 405 && error.message.includes('RESOURCE_LOCKED')) {
      // Esperar y reintentar después de un corto periodo
      console.warn('Reintentando suscripción en 5 segundos debido a RESOURCE_LOCKED...');
      setTimeout(() => subscribeToEvent(exchange, routingKey, handler), 5000);
    }
  }
}

function publishEvent(exchange, routingKey, message) {
  try {
    if (!channel) {
      throw new Error('Channel is not initialized. Call connectToRabbitMQ first.');
    }

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`Evento publicado en ${exchange} con routing key ${routingKey}`);
  } catch (error) {
    console.error('Error publishing event', error);
  }
}

module.exports = {
  connectToRabbitMQ,
  publishEvent,
  subscribeToEvent,
};
