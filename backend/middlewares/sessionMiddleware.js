const { isSessionActive } = require('./sessionService');

const sessionMiddleware = async (req, res, next) => {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(401).json({ message: 'Sesión no proporcionada' });
    }

    const isValid = await isSessionActive(sessionId);

    if (!isValid) {
        return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    next();
};

module.exports = sessionMiddleware;
