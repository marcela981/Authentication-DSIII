// sessionService.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config/database');

// Modelo para Sesiones
class Session extends Model {}

Session.init({
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Session',
  timestamps: true,
});

async function createSession(userId, sessionId, durationHours) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + durationHours);

  return await Session.create({
    sessionId,
    userId,
    expiresAt,
  });
}

async function closeSession(sessionId) {
  const session = await Session.findByPk(sessionId);
  if (session) {
    await session.destroy();
  } else {
    throw new Error('Sesión no encontrada');
  }
}

module.exports = {
  createSession,
  closeSession,
};
