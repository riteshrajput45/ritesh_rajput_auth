const express = require('express');
const authRouter = require('./router/authRouter');
const knex = require('./db');
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
