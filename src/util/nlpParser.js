// src/utils/nlpParser.js

exports.parseNaturalLanguageQuery = (query) => {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid or missing query");
  }

  const normalized = query.toLowerCase().trim();
  const filters = {};

  // Detect palindrome
  if (normalized.includes("palindromic") || normalized.includes("palindrome")) {
    filters.is_palindrome = true;
  }

  // Detect single/multiple word
  if (normalized.includes("single word")) filters.word_count = 1;
  if (normalized.includes("two words")) filters.word_count = 2;
  if (normalized.includes("three words")) filters.word_count = 3;

  // Detect length comparisons
  const longerMatch = normalized.match(/longer than (\d+)/);
  const shorterMatch = normalized.match(/shorter than (\d+)/);
  const exactlyMatch = normalized.match(/exactly (\d+) characters/);

  if (longerMatch) filters.min_length = parseInt(longerMatch[1], 10) + 1;
  if (shorterMatch) filters.max_length = parseInt(shorterMatch[1], 10) - 1;
  if (exactlyMatch) filters.min_length = filters.max_length = parseInt(exactlyMatch[1], 10);

  // Detect "containing the letter x"
  const containsCharMatch = normalized.match(/contain(?:s|ing)? (?:the letter )?([a-z])/);
  if (containsCharMatch) filters.contains_character = containsCharMatch[1];

  // Detect "first vowel"
  if (normalized.includes("first vowel") && !filters.contains_character) {
    filters.contains_character = "a";
  }

  // If no recognizable pattern
  if (Object.keys(filters).length === 0) {
    throw new Error("Unable to parse natural language query");
  }

  return filters;
};
