import service from "../../services/contacts.js";
import { contactSchema, contactFavSchema } from "../../utils/validation.js";

const get = async (req, res, next) => {
  try {
    const { user, query } = req;
    const contacts = await service.getContacts(user._id, query);

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contacts,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const {
      user,
      params: { id },
    } = req;

    const contact = await service.getContactById(user._id, id);

    if (!contact) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        data: { message: `Contact not found by id: ${id}` },
      });
      return;
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { user, body } = req;
    await contactSchema.validateAsync(body);
    const contact = await service.createContact({ ...body, owner: user._id });

    res.status(201).json({
      status: 201,
      statusText: "Created",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const remove = async (req, res, next) => {
  try {
    const {
      user,
      params: { id },
    } = req;

    const contact = await service.removeContact(user._id, id);

    if (!contact) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        data: { message: `Contact not found by id: ${id}` },
      });
      return;
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const {
      user,
      body,
      params: { id },
    } = req;

    await contactSchema.validateAsync(body);
    const contact = await service.updateContact(user._id, id, body);

    if (!contact) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        data: { message: `Contact not found by id: ${id}` },
      });
      return;
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const {
      user,
      body,
      params: { id },
    } = req;
    const { favorite } = body;

    await contactFavSchema.validateAsync(body);
    const contact = await service.updateContact(user._id, id, {
      favorite,
    });

    if (!contact) {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        data: { message: `Contact not found by id: ${id}` },
      });
      return;
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: err.message },
    });
  }
};

const contactsController = {
  get,
  getById,
  create,
  remove,
  update,
  updateFavorite,
};

export default contactsController;
