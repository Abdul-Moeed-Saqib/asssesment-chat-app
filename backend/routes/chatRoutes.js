const express = require("express");
const { auth } = require("../middleware/auth");
const { accessChat, receiveChats, createGroupChat, updateNameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, receiveChats);
router.post("/creategroup", auth, createGroupChat);
router.put("/updatename", auth, updateNameGroup);
router.put("/removefromgroup", auth, removeFromGroup);
router.put("/addtogroup", auth, addToGroup);

module.exports = router;