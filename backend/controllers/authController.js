const authService = require('../services/authService');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: newUser.id });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, sessionId } = await authService.authenticateUser(email, password);
    res.status(200).json({ success: true, token, sessionId });
  } catch (error) {
    if (error.status === 503) {
      // Redirigir al servicio de error
      res.status(503).json({ success: false, message: 'Servicio no disponible. Por favor, inténtalo más tarde.' });
    } else {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }
};

exports.revokeToken = async (req, res) => {
    try {
      const { token } = req.body;
      await authService.revokeToken(token);
      res.status(200).json({ success: true, message: 'Token revocado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al revocar el token' });
    }
  };
  
exports.unlockUser = async (req, res) => {
    try {
      const { email } = req.body;
      await authService.unlockUser(email);
      res.status(200).json({ success: true, message: 'Usuario desbloqueado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al desbloquear el usuario' });
    }
  };
  