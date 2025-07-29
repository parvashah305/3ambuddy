require("dotenv").config();

const { verifyToken } = require('@clerk/clerk-sdk-node');

const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x_auth_token'];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { sub: userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.userId = userId;
    console.log('Clerk userId (UUID):', userId);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken: verifyTokenMiddleware };