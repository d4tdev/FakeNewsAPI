const express = require('express');
const app = express();


const router = require('./routes');

router(app);

module.exports = app;
