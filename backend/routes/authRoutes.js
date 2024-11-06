const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint para autenticación
router.post('/authenticate', authController.authenticate);

// Endpoint para revocar token (compensación)
router.post('/revoke-token', authController.revokeToken);

// Endpoint para desbloquear usuario (compensación)
router.post('/unlock-user', authController.unlockUser);

module.exports = router;
