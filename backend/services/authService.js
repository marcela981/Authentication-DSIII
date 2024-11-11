const amqp = require('amqplib/callback_api');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CircuitBreaker = require('opossum');
const { publishEvent } = require('./eventBus');
const { closeSession, createSession } = require('./sessionService');
const uuid = require('uuid');
const User = require('../models/User');

let revokedTokens = []; // Lista para almacenar tokens revocados temporalmente


async function authenticateUser(email, password) {
  const user = await findUserByEmail(email); // Simulación de búsqueda de usuario
  if (!user) {
    throw { status: 401, message: 'Usuario no encontrado' };
  }
  //const userId = user.id;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Contraseña incorrecta' };
  }

  // Generar token JWT
  const token = generateToken(user);
  publishEvent('authExchange', 'authentication.succeeded', { userId: user.id, email: user.email });

  return { token, userId: user.id };
}

async function findUserByEmail(email) {
  // Simular fallo aleatorio en la base de datos
  if (Math.random() < 0.3) {
    console.error('Simulando fallo en la base de datos');
    throw new Error('Error al conectar con la base de datos');
  }

  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    throw new Error('Error al buscar el usuario en la base de datos');
  }
}

// Generar token JWT
function generateToken(user) {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: user.id }, 'tu_secreto_jwt', { expiresIn: '1h' });
}

exports.authenticateUser = async (email, password) => {
    const { token, userId } = await breaker.fire(email, password);

    // Crear sesión después de autenticación exitosa
    const sessionId = uuid.v4();
    //const userId = await findUserByEmail(email).id;
    await createSession(userId, sessionId, 24); // Sesión válida por 24 horas

    return { token, sessionId }; // Devolver el token y la sesión
};

// Configurar el Circuit Breaker
const breakerOptions = {
  timeout: 2000,
  errorThresholdPercentage: 50, 
  resetTimeout: 5000, 
};

const breaker = new CircuitBreaker(authenticateUser, breakerOptions);

// Fallback cuando el circuito está abierto o hay un fallo
breaker.fallback(() => {
  // Aquí puedes definir una respuesta predeterminada
  throw { status: 503, message: 'Servicio no disponible. Inténtelo más tarde.' };
});

// Manejar eventos del Circuit Breaker
breaker.on('open', () => {
  console.warn('Circuito abierto: las operaciones serán rechazadas hasta que se cierre.');
});

breaker.on('halfOpen', () => {
  console.info('Circuito medio abierto: probando si se puede cerrar.');
});

breaker.on('close', () => {
  console.info('Circuito cerrado: las operaciones pueden continuar.');
});


// Exportar la función para ser usada en el controlador
module.exports = {
  authenticateUser: (email, password) => breaker.fire(email, password),
  logoutUser: async (sessionId) => {
    await closeSession(sessionId);
  },
  revokeToken: (token) => {
    revokedTokens.push(token);
  },
  isTokenRevoked: (token) => {
    return revokedTokens.includes(token);
  },
  generateToken,
};

