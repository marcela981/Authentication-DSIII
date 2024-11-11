const { Sequelize } = require('sequelize');

// Configuración para SQLite (puedes ajustarlo según tu base de datos)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Ubicación del archivo de base de datos
  logging: false, // Desactiva el logging de SQL en consola
});

module.exports = sequelize;
