const express = require('express');
const config = require('./config');
const Room = require('./room');

const router = express.Router();

/** @type{Map<string, Room>} */

module.exports = router;
