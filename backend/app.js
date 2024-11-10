const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const RevokedToken = require('./models/RevokedToken');
const fs = require('fs');
const path = require('path');
const { connect, subscribeToEvent } = require('./services/eventBus');

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

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

const logDirectory = '/var/log/auth-service';
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'app.log'), { flags: 'a' });
console.log = (message) => {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
};

connect().then(() => {

  subscribeToEvent('userExchange', 'user.registered', handleUserRegistered);
});

function handleUserRegistered(content) {
  const { userId, email } = content;
  console.log(`Nuevo usuario registrado: ${email}`);

}

subscribeToEvent('orderExchange', 'order.failed', handleOrderFailed);

function handleOrderFailed(content) {
  const { userId } = content;
  console.log(`Transacción fallida para el usuario ${userId}. Revocando token.`);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
