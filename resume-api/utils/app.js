require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routers = require('./routers');
const { sequelize } = require('./models');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'ResumeFlow API is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, server: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({
      success: false,
      server: 'ok',
      database: 'disconnected',
      message: 'Check MySQL settings in .env'
    });
  }
});

app.use('/api', routers);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully.');
    await sequelize.sync();
    console.log('Database tables are ready.');
  } catch (error) {
    console.error('\nMySQL connection failed.');
    console.error('Make sure MySQL is running and the database exists.');
    console.error(error.message);
    console.error('The API will still start so /api/health can report the problem.\n');
  }

  app.listen(PORT, () => {
    console.log(`ResumeFlow API running at http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
