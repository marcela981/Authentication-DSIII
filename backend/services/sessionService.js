const db = require('../config/database');

// Crear sesión en la base de datos
exports.createSession = async (userId, sessionId, expiresInHours) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    await db.run(
        'INSERT INTO sessions (session_id, user_id, expires_at, is_active) VALUES (?, ?, ?, ?)',
        [sessionId, userId, expiresAt.toISOString(), true]
    );
};

// Marcar una sesión como cerrada
exports.closeSession = async (sessionId) => {
    await db.run('UPDATE sessions SET is_active = ? WHERE session_id = ?', [false, sessionId]);
};

// Revisar si una sesión es válida
exports.isSessionActive = async (sessionId) => {
    const result = await db.get(
        'SELECT * FROM sessions WHERE session_id = ? AND is_active = ? AND expires_at > CURRENT_TIMESTAMP',
        [sessionId, true]
    );
    return !!result; // Devuelve true si la sesión está activa
};
