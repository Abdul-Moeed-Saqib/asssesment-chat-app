const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const brypt = require('bcrypt');

const registerUser =  asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic
  });

  if (user) {
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Fialed to create the user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      throw Error("incorrect email");
    }

    const match = await brypt.compare(password, user.password);

    if (match) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error("Invalid Password");
    }
})

const allUsers = async (req, res) => {
  const key = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i"}},
      { email: { $regex: req.query.search, $options: "i"}}
    ]
  } : {};

  const users = await User.find(key).find({_id: {$ne: req.user._id}});

  res.send(users);
}

module.exports = { 
    registerUser, 
    loginUser,
    allUsers
};
