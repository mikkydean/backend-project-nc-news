const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Undeclared endpoint", () => {
  test("ALL METHODS 404: Responds with an error if an endpoint is not found", () => {
    return request(app)
      .get("/api/todays-news")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Endpoint not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Should respond with an array of topic objects with a slug and description as strings", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET 200: Should return with an array of topics with the correct content", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual([
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
          ]);
      });
  });
});
