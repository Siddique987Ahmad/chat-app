// const express = require('express');
// const { sendMessage } = require('../controllers/chatController');

// const router = express.Router();

// router.post('/send', sendMessage);

// module.exports = router;

const express = require('express');
const { sendMessage } = require('../controllers/chatController');

const router = express.Router();

// The 'io' object is passed from the server setup when establishing the connection
router.post('/send', (req, res) => {
    sendMessage(req, res, req.app.get('io'));
});

module.exports = router;
