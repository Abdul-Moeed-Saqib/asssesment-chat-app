const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chat = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const newChat = await Chat.create(chat);

            const fullChat = await Chat.findOne({_id: newChat._id}).populate("users", "-password");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const receiveChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } }})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1})
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });

                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.users) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("You need more than 2 users to create a group chat!");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const detailGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(detailGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const updateNameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedGroupChat = await Chat.findByIdAndUpdate(chatId, {
        chatName
    }, {
        new: true
    }).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedGroupChat) {
        res.status(404);
        throw new Error("Group chat doesn't exist!");
    } else {
        res.json(updatedGroupChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const addedToGroup = await  Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, {
        new: true
    }).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!addedToGroup) {
        res.status(404);
        throw new Error("Group chat does not exist!");
    } else {
        res.json(addedToGroup);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    }).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removeUser) {
        res.status(404);
        throw new Error("Group chat does not exist!");
    } else {
        res.json(removeUser);
    }
});

module.exports = {
    accessChat,
    receiveChats,
    createGroupChat,
    updateNameGroup,
    addToGroup,
    removeFromGroup
}