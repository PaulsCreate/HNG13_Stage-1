# HNG13 Stage-1: Advanced String Analysis API 🚀

## Overview

This is a robust Node.js Express API designed for comprehensive string analysis and management. It provides endpoints for storing, retrieving, analyzing various properties of strings, and even filtering them using natural language queries.

## Features

- `Node.js`: The JavaScript runtime environment powering the API.
- `Express.js`: The backend web framework providing a powerful API development foundation.
- `crypto`: Utilized for generating SHA-256 hashes of strings for unique identification.
- `express-rate-limit`: Implemented to protect the API from excessive requests and ensure fair usage.
- `helmet`: Enhances API security by setting various HTTP response headers.
- `cors`: Enables Cross-Origin Resource Sharing, allowing controlled access from different domains.
- `morgan`: Provides flexible HTTP request logging for development and production environments.
- `dotenv`: Securely manages environment variables for configuration.
- `In-Memory Data Store`: A simple, efficient data store for quick access and management of analyzed strings.
- `Natural Language Processing (NLP)`: Parses natural language queries to enable advanced, intuitive string filtering.
- `Detailed String Analysis`: Automatically calculates string length, checks for palindrome status, counts unique characters, determines word count, and generates character frequency maps.

## Getting Started

To get this API up and running locally, follow these simple steps:

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/PaulsCreate/HNG13_Stage-1.git
    cd HNG13_Stage-1
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Create Environment File**:
    Create a file named `conf.env` in the root directory of the project.
4.  **Run in Development Mode**:

    ```bash
    npm run dev
    ```

    The server will start on the configured `PORT` (default: 3000).

5.  **Run in Production Mode**:
    ```bash
    npm run start
    ```

### Environment Variables

The following environment variables are required to run the project. Create a `conf.env` file in the project root and populate it with these variables:

- `PORT`: The port number on which the server will listen.
  - Example: `PORT=3000`
- `NODE_ENV`: The current environment (`development`, `production`, or `test`). This affects logging verbosity and other configurations.
  - Example: `NODE_ENV=development`

## API Documentation

### Live Endpoint

The live endpoint for this API is: `https://paulssss.osc-fr1.scalingo.io/strings`

### Base URL

All API endpoints are prefixed with `/strings`.

### Endpoints

#### POST /strings

Creates and analyzes a new string, storing its properties.

**Request**:

```json
{
  "value": "string to be analyzed"
}
```

**Response**:

```json
{
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "character_frequency_map": {
      "H": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "W": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2024-07-30T10:00:00.000Z"
}
```

**Errors**:

- `400 Bad Request`: Missing "value" field.
- `422 Unprocessable Entity`: "value" must be a string.
- `409 Conflict`: String already exists.
- `500 Internal Server Error`: Unexpected server issue.

#### GET /strings/:string_value

Retrieves a single string and its analysis by its exact value.

**Request**:
Path parameter: `string_value` (the actual string value, URL-encoded if necessary).
Example: `GET /strings/hello%20world`

**Response**:

```json
{
  "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "value": "Hello World",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "character_frequency_map": {
      "H": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "W": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2024-07-30T10:00:00.000Z"
}
```

**Errors**:

- `404 Not Found`: String not found.
- `500 Internal Server Error`: Unexpected server issue.

#### GET /strings

Retrieves all stored strings, with optional filtering capabilities.

**Request**:
Query parameters (all optional):

- `is_palindrome`: `true` or `false`
- `min_length`: Minimum length (integer)
- `max_length`: Maximum length (integer)
- `word_count`: Exact word count (integer)
- `contains_character`: A single character to check for presence.

Example: `GET /strings?is_palindrome=true&min_length=5`

**Response**:

```json
{
  "data": [
    {
      "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2024-07-30T10:05:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": "true",
    "min_length": "5"
  }
}
```

**Errors**:

- `400 Bad Request`: Invalid query parameters (e.g., non-numeric `min_length`).

#### DELETE /strings/:string_value

Deletes a string from the store based on its exact value.

**Request**:
Path parameter: `string_value` (the actual string value, URL-encoded if necessary).
Example: `DELETE /strings/hello%20world`

**Response**:
`204 No Content`

**Errors**:

- `404 Not Found`: String not found.
- `500 Internal Server Error`: Unexpected server issue.

#### GET /strings/:filter_by_natural_language

Filters strings using a natural language query. Note: The path parameter `:filter_by_natural_language` is required by the route definition but its value is not directly used by the controller; filtering is based solely on the `query` URL parameter.

**Request**:
Path parameter: `:filter_by_natural_language` (any non-empty string, e.g., `filter-by-natural-language`).
Query parameter: `query` (a natural language phrase describing filter criteria).

Example: `GET /strings/any_value_here?query=strings longer than 5 characters and are palindromic`

**Response**:

```json
{
  "data": [
    {
      "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2024-07-30T10:05:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "strings longer than 5 characters and are palindromic",
    "parsed_filters": {
      "is_palindrome": true,
      "min_length": 6
    }
  }
}
```

**Errors**:

- `400 Bad Request`: Missing "query" parameter.
- `400 Bad Request`: Unable to parse natural language query.
- `500 Internal Server Error`: Unexpected server issue.

## Usage

Once the server is running, you can interact with the API using any HTTP client (e.g., cURL, Postman, Insomnia, or a web browser).

### Creating a String

To analyze and store a new string:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"value": "Hello World"}' http://localhost:3000/strings
```

### Retrieving All Strings

To fetch all currently stored strings:

```bash
curl http://localhost:3000/strings
```

### Retrieving Filtered Strings

You can add query parameters to filter strings by various properties:

- **Get all palindromic strings:**
  ```bash
  curl "http://localhost:3000/strings?is_palindrome=true"
  ```
- **Get strings longer than 10 characters:**
  ```bash
  curl "http://localhost:3000/strings?min_length=10"
  ```
- **Get strings with exactly 3 words containing the letter 'e':**
  ```bash
  curl "http://localhost:3000/strings?word_count=3&contains_character=e"
  ```

### Using Natural Language for Filtering

For more intuitive filtering, use the natural language endpoint:

```bash
curl "http://localhost:3000/strings/any_value_here?query=palindromic strings exactly 5 characters long"
```

_(Note: Replace `any_value_here` with any string as the path parameter is not used by the filtering logic itself, but is required by the route definition.)_

### Retrieving a Specific String

To get the analysis for a string you know exists:

```bash
curl http://localhost:3000/strings/madam
```

_(Ensure the string is URL-encoded if it contains special characters or spaces, e.g., `/strings/hello%20world`)_

### Deleting a String

To remove a string from the in-memory store:

```bash
curl -X DELETE http://localhost:3000/strings/madam
```

_(Ensure the string is URL-encoded if necessary)_

## Technologies Used

| Technology           | Purpose                                                                | Link                                                                                     |
| :------------------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| Node.js              | Powerful JavaScript runtime environment.                               | [nodejs.org](https://nodejs.org)                                                         |
| Express.js           | Fast, unopinionated, minimalist web framework for Node.js.             | [expressjs.com](https://expressjs.com)                                                   |
| `dotenv`             | Loads environment variables from a `.env` file.                        | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)                         |
| `helmet`             | Helps secure Express apps by setting various HTTP headers.             | [helmetjs.github.io](https://helmetjs.github.io/)                                        |
| `express-rate-limit` | Basic rate-limiting middleware for Express.                            | [npmjs.com/package/express-rate-limit](https://www.npmjs.com/package/express-rate-limit) |
| `cors`               | Provides a Connect/Express middleware that can be used to enable CORS. | [npmjs.com/package/cors](https://www.npmjs.com/package/cors)                             |
| `morgan`             | HTTP request logger middleware for node.js.                            | [npmjs.com/package/morgan](https://www.npmjs.com/package/morgan)                         |
| `crypto`             | Node.js built-in module for cryptographic functionality.               | [nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html)                         |
| Jest                 | Delightful JavaScript Testing Framework.                               | [jestjs.io](https://jestjs.io)                                                           |
| Supertest            | HTTP assertions for testing Node.js HTTP servers.                      | [npmjs.com/package/supertest](https://www.npmjs.com/package/supertest)                   |
| Prettier             | An opinionated code formatter.                                         | [prettier.io](https://prettier.io)                                                       |

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these guidelines:

- ✨ **Fork the repository** and clone it to your local machine.
- 🌿 **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
- 💻 **Make your changes** and ensure they adhere to the project's coding style.
- 🧪 **Write or update tests** to cover your changes.
- ✅ **Ensure all tests pass** (`npm test`).
- 📝 **Commit your changes** with a clear and concise message.
- ⬆️ **Push your branch** to your fork: `git push origin feature/your-feature-name`.
- 🤝 **Open a Pull Request** to the `main` branch of this repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author Info

**Paul Yusuf**

Connect with me:

- [LinkedIn](https://www.linkedin.com/in/paul-yusuf-8b5a97209/)
- [Twitter](https://x.com/GentlePaul17/)


## Badges

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/PaulsCreate/HNG13_Stage-1/actions)
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
