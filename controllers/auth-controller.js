import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;


const signup = async (req, res) => {
  const { email, password } = req.body;

  const avatarURL = gravatar.url(email);

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    username: user.username,
    email: user.email,
    subscription: user.subscription,
  });
};

const getCurrent = async (req, res) => {
  const { username, email, subscription } = req.user;

  res.json({
    username,
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Signout success" });
};

const subscriptionUpdate = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOneAndUpdate({ _id }, req.body);

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.cover(250, 250).quality(60).write(oldPath);
    })
    .catch((err) => {
      throw err;
    });

  const filename = `${_id}_${originalname}`;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate({ _id }, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  updateAvatar: ctrlWrapper(updateAvatar),
};