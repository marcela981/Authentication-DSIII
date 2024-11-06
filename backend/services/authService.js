const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let revokedTokens = []; // Lista para almacenar tokens revocados temporalmente

exports.authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email); // Implementa esta función según tu base de datos
  if (!user) {
    throw { status: 401, message: 'Usuario no encontrado' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Contraseña incorrecta' };
  }

  const token = jwt.sign({ id: user.id }, 'tu_secreto_jwt', { expiresIn: '1h' });
  return token;
};

exports.revokeToken = async (token) => {
  revokedTokens.push(token);
};

exports.isTokenRevoked = (token) => {
  return revokedTokens.includes(token);
};

// Función simulada para encontrar usuario
async function findUserByEmail(email) {
  if (email === 'usuario@example.com') {
    return {
      id: 1,
      email: 'usuario@example.com',
      password: await bcrypt.hash('password123', 10),
    };
  }
  return null;
}
