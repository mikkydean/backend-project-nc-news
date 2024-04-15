const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json")

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
});

describe("/api", () => {
    test("GET 200: Should return the updated endpoints.json file with information about avialable endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(JSON.parse(response.text)).toEqual({ endpoints} )
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET 200: Should return an article object with the required properties", () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            expect(typeof article.author).toBe("string")
            expect(typeof article.title).toBe("string")
            expect(typeof article.article_id).toBe("number")
            expect(typeof article.body).toBe("string")
            expect(typeof article.topic).toBe("string")
            expect(typeof article.created_at).toBe("string")
            expect(typeof article.votes).toBe("number")
            expect(typeof article.article_img_url).toBe("string")
        })
    })
    test("GET 404: Should return a 404 'Not found' error if the article ID is not in the database", () => {
      return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found")
      })
    })
    test("GET 400: Should return a 400 'Invalid request' error if the article ID is of the incorrect type", () => {
      return request(app)
      .get("/api/articles/headlines")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid request")
      })
    })
})