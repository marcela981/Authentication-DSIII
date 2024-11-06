const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'No se proporcionó un token' });
  }

  if (authService.isTokenRevoked(token)) {
    return res.status(401).json({ success: false, message: 'Token revocado' });
  }

  jwt.verify(token, 'tu_secreto_jwt', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    req.userId = decoded.id;
    next();
  });
};
