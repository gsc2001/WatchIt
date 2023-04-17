const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const config = require('./config');

app.get('/', (req, res) => {
    res.send('<h1>Hello fda sd world</h1>');
});

server.listen(config.PORT, () => {
    console.log('Server started!');
});
