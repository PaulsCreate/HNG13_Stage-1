// src/database/Stringstore.js

const store = new Map();

exports.addString = (item) => {
  store.set(item.id, item);
  return item;
};

exports.getStringById = (id) => {
  return store.get(id) || null;
};

exports.getStringByValue = (value) => {
  for (const item of store.values()) {
    if (item.value === value) return item;
  }
  return null;
};

exports.getAllStrings = () => {
  return Array.from(store.values());
};

exports.deleteString = (id) => {
  return store.delete(id);
};

exports.exists = (id) => {
  return store.has(id);
};

exports.clearAll = () => {
  store.clear();
};
