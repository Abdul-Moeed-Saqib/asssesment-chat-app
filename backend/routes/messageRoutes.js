const express = require('express');
const { auth } = require('../middleware/auth');
const { sendMessage, allMessages } = require('../controllers/messageController');

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, allMessages);

module.exports = router;