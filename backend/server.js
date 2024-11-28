const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

app.use(cors()); 
app.use(express.json()); 

// Endpoint para crear un usuario
app.post('/api/register', (req, res) => {
  const { email, fullName, address, password } = req.body;

  // Aquí iría la lógica para agregar al usuario a la base de datos
  // Por ejemplo, podrías crear un nuevo usuario en Firebase Authentication
  // o en tu base de datos personalizada.

  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// Endpoint para obtener información del usuario
app.get('/api/user/:email', (req, res) => {
  const email = req.params.email;

  // Aquí podrías obtener detalles del usuario desde la base de datos
  res.json({ email, fullName: 'John Doe', address: '123 Street Name' });
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  
  app.use(cors()); 
  app.use(express.json());
  
  app.post('/api/protected-endpoint', async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).send('No token provided');
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      // Ahora puedes usar el UID para acceder a la base de datos del usuario
      res.json({ message: `Hello, user ${uid}` });
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
