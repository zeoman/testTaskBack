const express = require('express');
const config = require('config');
const PORT = config.get('port') || 5000;
process.env.TZ = config.get('UTC');

const mongoose = require('mongoose');
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTwsNS");
  next();
});
app.use(express.json({msExtendedCode: true}));

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    app.listen(PORT, () => console.log(`App is running on port ${PORT}...`));
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}
start();
