const express = require('express');
const { registerUser, loginUser, allUsers } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// User Authentication
router.post("/", registerUser)
router.post("/login", loginUser);


router.get("/", auth ,allUsers);

module.exports = router;