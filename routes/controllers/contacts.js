import service from "../../services/contacts.js";
import authService from "../../services/auth.js";

const get = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;
    const contacts = await service.getContacts(ownerId);

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
  const { id } = req.params;
  const ownerId = req.user.userId;

  try {
    const contact = await service.getContactById(id,ownerId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
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

const create = async (req, res) => {
  const body = req.body;
  const ownerId = req.user.userId;

  try {
    const contact = await service.createContact({ ...body, owner: ownerId });

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
      message: err.message,
    });
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await service.removeContact(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
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

const update = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const contact = await service.updateContact(id, body);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
    }

    await contact.validate();

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
      message: err.message,
    });
  }
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const body = Object.hasOwn(req.body, "favorite") ? req.body : null;

  try {
    if (body) {
      const contact = await service.updateContact(id, {
        favorite: body.favorite,
      });

      if (!contact) {
        return res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
      }

      res.json({
        status: 200,
        statusText: "OK",
        data: {
          contact,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        statusText: "Bad Request",
        message: "Missing field 'favorite'",
      });
    }
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const ctrlContacts = {
  get,
  getById,
  create,
  remove,
  update,
  updateStatusContact,
};

export default ctrlContacts;