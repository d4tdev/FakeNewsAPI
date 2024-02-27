const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
   cors({
      origin: '*',
   })
);

const router = require('./routes');

router(app);

module.exports = app;
