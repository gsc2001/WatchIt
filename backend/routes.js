const express = require('express');

const router = express.Router();

router.get('/ping', async (req, res) => {
    res.json({ success: true, server_time: Date.now() });
});

module.exports  = router