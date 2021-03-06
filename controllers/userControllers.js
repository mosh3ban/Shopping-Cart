import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).send({
      _id: user._id,
      name: user.name,
      email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
  console.log('aaaaaa');
  res.status(401);
  throw new Error('Invalid email or password');
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email Already Exists');
  }

  const user = await User.create({ name, email, password });
  if (!user) {
    res.status(500);
    throw new Error('invalid user data');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
  res.status(404);
  throw new Error('User is not found');
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
  res.status(404);
  throw new Error('user not found');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(401);
    throw new Error('user is not found');
  }
  const deletedUser = await user.remove();
  res.json({ deleteUser });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User is not found');
  }
  res.send(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }

  res.status(404);
  throw new Error('user is not found');
});
export {
  authUser,
  getProfile,
  registerUser,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUserById,
};
