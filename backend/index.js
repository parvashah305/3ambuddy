const express = require('express');
const dotenv = require('dotenv');
const transcriptionRoutes = require('./routes/transcriptionRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', transcriptionRoutes);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});