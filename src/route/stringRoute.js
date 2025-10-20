const express = require('express');
const stringController = require('../controller/stringController');
const route = express.Router();

route.get('/', stringController.getAll);
route.post('/', stringController.createString);
route.get('/:string_value', stringController.getString);
route.delete('/:string_value', stringController.deleteStringByValue);
route.get(
  '/:filter-by-natural-language',
  stringController.filterByNaturalLanguage
);

module.exports = route;
