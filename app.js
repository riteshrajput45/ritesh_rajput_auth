const express = require('express');
const authRouter = require('./router/authRouter');
const knex = require('./db');
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

// 404 for unknown routes
app.use((req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const code = err && (err.code || (err.nativeError && err.nativeError.code));

  if (code === '23505') return res.status(409).json({ error: 'Resource already exists' });
  if (code === '23502') return res.status(400).json({ error: 'Invalid or missing fields' });
  if (code === '42703') return res.status(400).json({ error: 'Invalid request' });

  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Something went wrong' });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
