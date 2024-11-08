const authService = require('../services/authService');

exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.authenticateUser(email, password);
    res.status(200).json({ success: true, token });
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
  