const express = require('express');
const { generateRandomCode } = require('./utils/general');
const config = require('./config');
const Room = require('./room');

const router = express.Router();

/** @type{Map<string, Room>} */

module.exports = router;
