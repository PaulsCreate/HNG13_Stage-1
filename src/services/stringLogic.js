// src/services/stringLogic.js
const crypto = require('crypto');

// Compute SHA-256 hash
exports.hashString = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

// Case-insensitive palindrome check (ignores spaces)
exports.isPalindrome = (value) => {
  const normalized = value.toLowerCase().replace(/\s+/g, '');
  return normalized === normalized.split('').reverse().join('');
};

// Character frequency mapping
exports.getCharacterFrequencyMap = (value) => {
  return [...value].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
};

// Analyze string properties
exports.analyzeString = (value) => {
  if (typeof value !== 'string') throw new Error('Value must be a string');

  const hash = exports.hashString(value);
  const properties = {
    length: value.length,
    is_palindrome: exports.isPalindrome(value),
    unique_characters: new Set(value).size,
    word_count: value.trim() ? value.trim().split(/\s+/).length : 0,
    sha256_hash: hash,
    character_frequency_map: exports.getCharacterFrequencyMap(value),
  };

  return {
    id: hash,
    value,
    properties,
    created_at: new Date().toISOString(),
  };
};

// Filtering utility
exports.filterStrings = (strings, filters = {}) => {
  return strings.filter((item) => {
    const { properties } = item;

    if (
      filters.is_palindrome !== undefined &&
      properties.is_palindrome !== (filters.is_palindrome === 'true')
    ) {
      return false;
    }

    if (filters.min_length) {
      const minLength = parseInt(filters.min_length, 10);
      if (isNaN(minLength)) {
        throw new Error('Invalid min_length parameter');
      }
      if (properties.length < minLength) {
        return false;
      }
    }

    if (filters.max_length) {
      const maxLength = parseInt(filters.max_length, 10);
      if (isNaN(maxLength)) {
        throw new Error('Invalid max_length parameter');
      }
      if (properties.length > maxLength) {
        return false;
      }
    }

    if (filters.word_count) {
      const wordCount = parseInt(filters.word_count, 10);
      if (isNaN(wordCount)) {
        throw new Error('Invalid word_count parameter');
      }
      if (properties.word_count !== wordCount) {
        return false;
      }
    }

    if (
      filters.contains_character &&
      !item.value.includes(filters.contains_character)
    ) {
      return false;
    }

    return true;
  });
};
