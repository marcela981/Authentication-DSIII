const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class RevokedToken extends Model {}

RevokedToken.init({
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'RevokedToken',
  timestamps: true,
});

module.exports = RevokedToken;
