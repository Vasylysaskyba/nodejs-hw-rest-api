import Contact from "../models/Contact.js";
import fs from "fs/promises";
import path from "path";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const avatarsPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find(
    favorite ? { owner, favorite } : { owner },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "username email subscription");
  res.json(result);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner });
  // const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

  
  const add = async (req, res) => {
    const {_id: owner} = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("public", "avatars", filename);
    const result = await Contact.create({...req.body, avatar, owner});
    res.status(201).json(result);
}


const updateById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
  // const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }

  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
  // const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }

  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id });
  // const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }

  res.json({
    message: "Delete success",
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteById: ctrlWrapper(deleteById),
};