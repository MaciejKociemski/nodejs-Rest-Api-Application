import Contact from "./models/contacts.js";

const getContacts = async (userId, { page = 1, limit = 20, favorite }) => {
  try {
    const query =
      favorite === "true" || favorite === "false"
        ? { owner: userId, favorite }
        : { owner: userId };

    return await Contact.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (userId, id) => {
  try {
    return await Contact.findOne({ owner: userId, _id: id }).lean();
  } catch (err) {
    console.error(err.message);
  }
};

const createContact = async (body) => {
  try {
    return await Contact.create(body);
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async (userId, id) => {
  try {
    return await Contact.findOneAndRemove({ owner: userId, _id: id }).lean();
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (userId, id, body) => {
  try {
    return await Contact.findOneAndUpdate({ owner: userId, _id: id }, body, {
      runValidators: true,
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const contactService = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
};

export default contactService;
