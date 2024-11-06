const { Sequelize } = require('sequelize');

// Para SQLite (pruebas locales)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // Nombre del archivo de base de datos
});

// Para PostgreSQL o MySQL, configura con tus credenciales
/*
const sequelize = new Sequelize('nombre_bd', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'postgres', // o 'mysql'
});
*/

module.exports = sequelize;
