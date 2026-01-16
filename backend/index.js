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

const allowedOrigins = [process.env.CLIENT_WEB_HOST, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    callback(null, true);
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

server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});