const express = require("express");

const { validateBody, ctrlWrapper } = require("../../utils");
const { contacts: ctrl } = require("../../controllers");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getListContacts));

router.get("/:contactId", ctrlWrapper(ctrl.getContactId));

router.post(
  "/",
  validateBody(schemas.addSchema),
  ctrlWrapper(ctrl.addNewContact)
);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.updateStatusSchema),
  ctrlWrapper(ctrl.updateStatusContact)
);

router.delete("/:contactId", ctrlWrapper(ctrl.removeContactById));

router.put(
  "/:contactId",
  validateBody(schemas.addSchema),
  ctrlWrapper(ctrl.updateContactById)
);

module.exports = router;