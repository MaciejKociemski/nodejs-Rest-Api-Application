import Contact from "./models/contacts";

const getContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.error("Error fetching contacts:", err.message);
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (err) {
    console.error("Error fetching contact by ID:", err.message);
    throw err;
  }
};

const createContact = async (contactData) => {
  try {
    return await Contact.create(contactData);
  } catch (err) {
    console.error("Error creating contact:", err.message);
    throw err;
  }
};

const updateContact = async (contactId, contactData) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, contactData, {
      new: true,
    });
  } catch (err) {
    console.error("Error updating contact:", err.message);
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove(contactId);
  } catch (err) {
    console.error("Error removing contact:", err.message);
    throw err;
  }
};

const service = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};

export default service;
