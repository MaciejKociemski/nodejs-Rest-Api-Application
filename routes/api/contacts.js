const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const schema = require("../../utils/validation");

const router = express.Router();

const validateData = async (req, res, next) => {
  try {
    const body = await schema.validateAsync(req.body);
    req.validatedData = body;
    next();
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message,
    });
  }
};

router.use(express.json());

router.get("/", async (_, res, next) => {
  try {
    const contacts = await listContacts();

    if (contacts.length > 0) {
      res.json({
        status: 200,
        data: {
          contacts,
        },
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      res.json({
        status: 200,
        data: {
          contact,
        },
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", validateData, async (req, res, next) => {
  try {
    const contact = { id: uuidv4(), ...req.validatedData };
    await addContact(contact);

    res.status(201).json({
      status: 201,
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message,
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const condition = await removeContact(contactId);

    if (condition) {
      res.json({
        status: 200,
        message: "contact deleted",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", validateData, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.validatedData);

    if (contact) {
      res.json({
        status: 200,
        data: {
          contact,
        },
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message,
    });
  }
});

module.exports = router;
