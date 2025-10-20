
// src/controllers/stringController.js
const {
  analyzeString,
  hashString,
  filterStrings,
} = require('../services/stringLogic');
const {
  addString,
  getStringById,
  getAllStrings,
  deleteString,
  exists,
} = require('../database/stringStore');

const { nlpParser } = require('../util/nlpParser');

// POST /strings
exports.createString = (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Missing "value" field' });
    }

    if (typeof value !== 'string') {
      return res.status(422).json({ error: '"value" must be a string' });
    }

    const hash = hashString(value);
    if (exists(hash)) {
      return res.status(409).json({ error: 'String already exists' });
    }

    const analyzed = analyzeString(value);
    addString(analyzed);
    return res.status(201).json(analyzed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /strings/:string_value
exports.getString = (req, res) => {
  try {
    const stringValue = req.params.string_value;
    const hash = hashString(stringValue);
    const found = getStringById(hash);

    if (!found) {
      return res.status(404).json({ error: 'String not found' });
    }

    return res.status(200).json(found);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /strings
exports.getAll = (req, res) => {
  try {
    const all = getAllStrings();
    const filtered = filterStrings(all, req.query);

    return res.status(200).json({
      data: filtered,
      count: filtered.length,
      filters_applied: req.query,
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid query parameters' });
  }
};

// DELETE /strings/:string_value
exports.deleteStringByValue = (req, res) => {
  try {
    const stringValue = req.params.string_value;
    const hash = hashString(stringValue);

    if (!exists(hash)) {
      return res.status(404).json({ error: 'String not found' });
    }

    deleteString(hash);
    return res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /strings/filter-by-natural-language
exports.filterByNaturalLanguage = (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Missing "query" parameter' });
    }

    let parsedFilters;
    try {
      parsedFilters = parseNaturalLanguageQuery(query);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const allStrings = require('../database/stringStore').getAllStrings();
    const { filterStrings } = require('../services/stringLogic');
    const filtered = filterStrings(allStrings, parsedFilters);

    return res.status(200).json({
      data: filtered,
      count: filtered.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
