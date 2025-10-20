// tests/stringRoutes.test.js
const request = require("supertest");
const app = require("../src/app");

// Since it's in-memory, we can import the store directly to clear between tests
const store = require("../src/database/stringStore"); // adjust if path differs

beforeEach(() => {
  store.clearAll();
});

describe("String Analyzer API (In-Memory)", () => {
  test("POST /strings → creates a new string successfully", async () => {
    const res = await request(app)
      .post("/strings")
      .send({ value: "madam" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.value).toBe("madam");
    expect(res.body.properties.is_palindrome).toBe(true);
  });

  test("POST /strings → returns 409 when string already exists", async () => {
    await request(app).post("/strings").send({ value: "hello" });
    const res = await request(app)
      .post("/strings")
      .send({ value: "hello" })
      .expect(409);

    expect(res.body.error).toMatch(/exists/i);
  });

  test("GET /strings/:string_value → returns the string record", async () => {
    await request(app).post("/strings").send({ value: "wow" });
    const res = await request(app).get("/strings/wow").expect(200);

    expect(res.body.value).toBe("wow");
    expect(res.body.properties.is_palindrome).toBe(true);
  });

  test("GET /strings → returns all strings", async () => {
    await request(app).post("/strings").send({ value: "apple" });
    await request(app).post("/strings").send({ value: "banana" });

    const res = await request(app).get("/strings").expect(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  test("DELETE /strings/:string_value → deletes a string successfully", async () => {
    await request(app).post("/strings").send({ value: "deleteMe" });
    await request(app).delete("/strings/deleteMe").expect(204);

    const res = await request(app).get("/strings/deleteMe");
    expect(res.status).toBe(404);
  });

  test("POST /strings → returns 422 for invalid type", async () => {
    const res = await request(app)
      .post("/strings")
      .send({ value: 12345 })
      .expect(422);
    expect(res.body.error).toMatch(/must be a string/i);
  });

  test("POST /strings → returns 400 for missing field", async () => {
    const res = await request(app).post("/strings").send({}).expect(400);
    expect(res.body.error).toMatch(/missing/i);
  });
});

describe("GET /strings (Filtering)", () => {
  beforeEach(async () => {
    // Prepare sample strings
    await request(app).post("/strings").send({ value: "madam" }); // palindrome, 1 word
    await request(app).post("/strings").send({ value: "racecar" }); // palindrome, 1 word
    await request(app).post("/strings").send({ value: "hello world" }); // not palindrome, 2 words
    await request(app).post("/strings").send({ value: "banana" }); // not palindrome
  });

  test("returns only palindromic strings", async () => {
    const res = await request(app)
      .get("/strings?is_palindrome=true")
      .expect(200);

    expect(res.body.count).toBe(2);
    res.body.data.forEach((item) =>
      expect(item.properties.is_palindrome).toBe(true)
    );
  });

  test("returns strings within min and max length range", async () => {
    const res = await request(app)
      .get("/strings?min_length=5&max_length=6")
      .expect(200);

    expect(
      res.body.data.every((item) => {
        const len = item.properties.length;
        return len >= 5 && len <= 6;
      })
    ).toBe(true);
  });

  test("returns strings with specific word count", async () => {
    const res = await request(app).get("/strings?word_count=2").expect(200);

    expect(res.body.count).toBe(1);
    expect(res.body.data[0].value).toBe("hello world");
  });

  test("returns strings containing a specific character", async () => {
    const res = await request(app)
      .get("/strings?contains_character=a")
      .expect(200);

    expect(res.body.count).toBeGreaterThan(0);
    res.body.data.forEach((item) =>
      expect(item.value.toLowerCase()).toContain("a")
    );
  });

  test("returns 400 for invalid query params", async () => {
    const res = await request(app).get("/strings?min_length=abc").expect(400);

    expect(res.body.error).toMatch(/invalid/i);
  });
});
