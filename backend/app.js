const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const RevokedToken = require('./models/RevokedToken');

const authRoutes = require('./routes/authRoutes');


const app = express();

sequelize.sync()
  .then(() => {
    console.log('Base de datos y tablas creadas');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

app.use(cors());
app.use(bodyParser.json());

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
