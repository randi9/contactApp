const fs = require("fs");

// Create folder data if not exist
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Create file contacts.json if not exist
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Load/Read Object from contacts.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// Load/Read specific Contact based on Name
const findContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  return contact;
};

// Write new Contact to contacts.json
const saveContact = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// Wrapper Function to add new Contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContact(contacts);
};

// Check if there is a duplicate contact or not
const dupCheck = (name) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.name === name);
};

// Delete a contact
const deleteContact = (name) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  saveContact(filteredContacts);
};

// Update a contact
const updateContact = (newContact) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== newContact.oldName
  );
  delete newContact.oldName;
  filteredContacts.push(newContact);
  saveContact(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  dupCheck,
  deleteContact,
  updateContact,
};
