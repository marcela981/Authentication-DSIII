const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const RevokedToken = require('./models/RevokedToken');
const fs = require('fs');
const path = require('path');
const amqp = require('amqplib/callback_api');
const User = require('./models/User');


//const passport = require('./config/passport-config');
//const session = require('express-session');
const { connectToRabbitMQ, subscribeToEvent } = require('./services/eventBus');
//const sessionMiddleware = require('./sessionMiddleware');

const authRoutes = require('./routes/authRoutes');


const app = express();




sequelize.sync()
  .then(() => {
    console.log('Base de datos y tablas creadas');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

app.use(cors());
app.use(bodyParser.json());
//pp.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());


// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);
//app.use('/api/auth/protected', sessionMiddleware);

const logDirectory = '/var/log/auth-service';
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'app.log'), { flags: 'a' });
console.log = (message) => {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
};


// Conectar a RabbitMQ y suscribirse a los eventos necesarios
connectToRabbitMQ().then(() => {
  subscribeToEvent('userExchange', 'user.registered', handleUserRegistered);
  subscribeToEvent('orderExchange', 'order.failed', handleOrderFailed);
}).catch((error) => {
  console.error('Failed to connect to RabbitMQ', error);
});

async function handleUserRegistered(content) {
  const { userId, email } = content;
  console.log(`Nuevo usuario registrado: ${email}`);
  
  if (!email) {
    console.error('El campo email es undefined en el evento user.registered');
    return;
  }

  try {
  const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('El usuario ya existe en la base de datos.');
    } else {
      const newUser = await User.create({ email, password: 'defaultPassword' });
      console.log('Usuario creado en la base de datos.');
    }
  } catch (error) {
    console.error('Error al manejar el evento user.registered:', error);
  }
}

amqp.connect('amqp://myuser:mypassword@rabbitmq', (error, connection) => {
  if (error) {
    console.error('Failed to connect to RabbitMQ', error);
    return;  // Salir en lugar de intentar continuar sin una conexión
  }

  console.log('RabbitMQ Connected');

  // Crear el canal para RabbitMQ
  connection.createChannel((err, channel) => {
    if (err) {
      console.error('Error creando el canal:', err);
      return;  
    }

    const exchange = 'authExchange';
    const exchangeType = 'topic';

    channel.assertExchange(exchange, exchangeType, {
      durable: true,
    }, (err) => {
      if (err) {
        console.error('Error declarando el exchange:', err);
      } else {
        console.log(`Exchange '${exchange}' declarado correctamente.`);
      }
    });

    try {
      subscribeToEvent('userExchange', 'user.registered', handleUserRegistered);
      subscribeToEvent('orderExchange', 'order.failed', handleOrderFailed);
    } catch (err) {
      console.error('Error durante la suscripción a eventos:', err);
    }
  });

  // Manejar cierre de conexión
  connection.on('error', (err) => {
    console.error('Error en la conexión de RabbitMQ:', err);
  });
});

subscribeToEvent('orderExchange', 'order.failed', handleOrderFailed);

function handleOrderFailed(content) {
  const { userId } = content;
  console.log(`Transacción fallida para el usuario ${userId}. Revocando token.`);
}

const PORT = process.env.PORT || 5555;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
