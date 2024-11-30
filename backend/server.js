import express from 'express';
import cors from 'cors';
import { auth, admin } from './config/firebaseConfig.js';


const app = express();
const port = 5000;

app.use(cors()); 
app.use(express.json()); 

// Endpoint para crear un usuario
app.post('/api/register', (req, res) => {
  const { email, fullName, address, password } = req.body;
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});