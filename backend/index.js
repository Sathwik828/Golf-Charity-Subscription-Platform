const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const scoreRoutes = require('./routes/score');
const drawRoutes = require('./routes/draw');
const charityRoutes = require('./routes/charity');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const winnerRoutes = require('./routes/winner');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/winners', winnerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
