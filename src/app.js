const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
   cors({
      origin: '*',
   })
);

const routes = require('./routes');

routes(app);

module.exports = app;
