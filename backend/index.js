const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const initializeSocket = require('./socket/socket');
const clerkWebHookController = require('./controllers/clerk/clerkWebHookController');
const { verifyToken } = require('./middleware/clerk');
const chat_engine = require('./services/chat_engine');

const app = express();
app.use('/api/webhooks', express.raw({ type: 'application/json' }), clerkWebHookController);

const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_WEB_HOST,
  'https://3ambuddy.vercel.app', // Explicitly allow the primary production domain
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean).map(url => url.replace(/\/$/, "")); // Remove trailing slashes

console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Normalize incoming origin
    const normalizedOrigin = origin.replace(/\/$/, "");
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      // Instead of returning an Error object, we return null, false
      // so the cors middleware handles it by sending a 204 or 403
      // rather than the server crashing or sending a 500.
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/api', verifyToken);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const reply = await chat_engine(message);
    res.json({ reply });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Token verified successfully!',
    userId: req.userId,
  });
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initializeSocket(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
});