import { authenticateUser } from '../services/authService.js';
import { admin } from '../firebaseConfig.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';


export const register = async (req, res) => {
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    // Aquí iría la lógica para generar un JWT y devolverlo
    const token = 'generated-jwt-token'; // Esto debería ser generado de forma real
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(500).json({ message: 'Error al autenticar el usuario.' });
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
  
  admin.auth().verifyIdToken(idToken);