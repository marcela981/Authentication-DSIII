const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CircuitBreaker = require('opossum');
const { publishEvent } = require('./eventBus');

let revokedTokens = []; // Lista para almacenar tokens revocados temporalmente


async function authenticateUser(email, password) {
  const user = await findUserByEmail(email); // Simulación de búsqueda de usuario
  if (!user) {
    throw { status: 401, message: 'Usuario no encontrado' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Contraseña incorrecta' };
  }

  // Generar token JWT
  const token = generateToken(user);
  publishEvent('authExchange', 'authentication.succeeded', { userId: user.id, email: user.email });

  return token;
}

async function findUserByEmail(email) {
  // Simular fallo aleatorio en la base de datos
  if (Math.random() < 0.5) {
    console.error('Simulando fallo en la base de datos');
    throw new Error('Error al conectar con la base de datos');
  }

  if (email === 'usuario@example.com') {
    return {
      id: 1,
      email: 'usuario@example.com',
      password: await bcrypt.hash('password123', 10),
    };
  }
  return null;
}

// Generar token JWT
function generateToken(user) {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: user.id }, 'tu_secreto_jwt', { expiresIn: '1h' });
}

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
exports.authenticateUser = (email, password) => {
  return breaker.fire(email, password);
};

exports.revokeToken = async (token) => {
  revokedTokens.push(token);
};

exports.isTokenRevoked = (token) => {
  return revokedTokens.includes(token);
};



