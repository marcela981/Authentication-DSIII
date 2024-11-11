const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//const passport = require('../passport-config');
const authService = require('../services/authService');



// Endpoint para autenticación
router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, sessionId } = await authService.authenticateUser(email, password);
    res.status(200).json({ success: true, token, sessionId });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});


// Endpoint para revocar token (compensación)
router.post('/revoke-token', authController.revokeToken);

// Endpoint para desbloquear usuario (compensación)
router.post('/unlock-user', authController.unlockUser);

router.post('/logout', async (req, res) => {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(400).json({ message: 'Sesión no proporcionada' });
    }

    try {
        await logoutUser(sessionId);
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar la sesión' });
    }
});

// Ruta para iniciar sesión con Google
//router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google
//router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Generar el token JWT al autenticar exitosamente
  //const token = generateToken(req.user);
  //res.json({ token });
//});

// Ruta para iniciar sesión con GitHub
//router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback de GitHub
//router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  // Generar el token JWT al autenticar exitosamente
  //const token = generateToken(req.user);
  //res.json({ token });
//});

router.post('/register', authController.register);

module.exports = router;
