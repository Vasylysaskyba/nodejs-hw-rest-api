import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  contactAddSchema,
  contactUpdateSchema,
  updateFavoriteSchema,
} from "../../models/Contact.js";

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateValidate = validateBody(contactUpdateSchema);
const contactUpdateFavoriteValidate = validateBody(updateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post(
  "/", upload.single("avatar"),
  isEmptyBody,
  contactAddValidate,
  contactsController.add
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  contactUpdateValidate,
  contactsController.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  contactUpdateFavoriteValidate,
  contactsController.updateFavorite
);

contactsRouter.delete("/:id", isValidId, contactsController.deleteById);

export default contactsRouter;