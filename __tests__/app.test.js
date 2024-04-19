const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

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
        expect(JSON.parse(response.text)).toEqual({ endpoints });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET 200: Should return an article object with the required properties", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.author).toBe("icellusedkars");
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.article_id).toBe(3);
          expect(article.body).toBe("some gifs");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("GET 200: Should also return a comment count for the specified article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(11);
        });
    });
    test("GET 404: Should return a 404 'Not found' error if the article ID is not in the database", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Not found");
        });
    });
    test("GET 400: Should return a 400 'Invalid request' error if the article ID is of the incorrect type", () => {
      return request(app)
        .get("/api/articles/headlines")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
  });
  describe("PATCH", () => {
    test("PATCH 200: Should update the votes for an article by the specified amount and return the updated article", () => {
      const voteCount = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/3")
        .send(voteCount)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.author).toBe("icellusedkars");
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.article_id).toBe(3);
          expect(article.body).toBe("some gifs");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(10);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("PATCH 404: Should return a 404 'Article ID not found' error if the article ID is not in the database", () => {
      return request(app)
        .patch("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Article ID not found");
        });
    });
    test("PATCH 400: Should return a 400 error if the vote object provided has an incorrect key", () => {
      const voteCount = { increment_votes: 10 };
      return request(app)
        .patch("/api/articles/3")
        .send(voteCount)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe(
            "Invalid request: Object has incorrect properties"
          );
        });
    });
    test("PATCH 400: Should return a 400 error if the vote object provided has an incorrect value", () => {
      const voteCount = { inc_votes: "ten" };
      return request(app)
        .patch("/api/articles/3")
        .send(voteCount)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("GET 200: Should respond with an array of article objects of the correct length with the specified properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("GET 200: Should respond with the correct comment count total for the articles in the array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          if (articles.article_id === 1) {
            expect(articles.comment_count).toBe(11);
          }
          if (articles.article_id === 9) {
            expect(articles.comment_count).toBe(2);
          }
          if (articles.article_id === 4) {
            expect(articles.comment_count).toBe(0);
          }
        });
    });
    test("GET 200: There should not be a body property present on any of the article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(typeof article.body).toBe("undefined");
          });
        });
    });
    test("GET 200: The articles should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "created_at", descending: true });
        });
    });
    test("GET 200: Should accept a topic query and filter articles by the specified topic value", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("GET 200: Should accept a sort_by query to sort articles by any valid column (defaulting to the created_at date", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "title", descending: true });
        });
    });
    test("GET 200: Should accept an order query to display articles in ascending or descending order", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "author", descending: false });
        });
    });
    test("GET 200: Should return an empty array if a topic exists but there are no associated articles", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0)
      })
    })
    test("GET 200: Should limit the number of responses to 10 by default", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(10)
      })
    })
    test("GET 200: Should limit the number of responses to a specified value other than 10", () => {
      return request(app)
      .get("/api/articles?length=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(5)
      })
    })
    test("GET 200: Should accept a 'p' query  that specifies the page at which to start", () => {
      return request(app)
      .get("/api/articles?p=2&length=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles[0].title).toBe("Living in the shadow of a great man")
        expect(articles.length).toBe(5)
      })
    })
    test("GET 200: Should respond with a total_count property", () => {
      return request(app)
      .get("/api/articles?length=5&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { total_count } = body
        expect(total_count).toBe(12)
      })
    })
    test("GET 404: Responds with an error if the endpoint is not found", () => {
      return request(app)
        .get("/api/article_endpoint")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Endpoint not found");
        });
    });
    test("GET 404: Should return a 404 error if a topic does not exist in the database", () => {
      return request(app)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Topic not found");
        });
    });
    test("GET 400: Should return a 400 error if the sort-by value is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=written_by")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid query value");
        });
    });
    test("GET 400: Should return a 400 error if the order value is not valid", () => {
      return request(app)
        .get("/api/articles?order=top_to_bottom")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid query value");
        });
    });
    test("GET 400: Should return a 400 error if a pagination value is not valid", () => {
      return request(app)
      .get("/api/articles?p=2&length=five")
      .expect(400)
      .then(({ body }) => {
        const { message } = body
        expect(message).toBe("Invalid request: Value has incorrect format")
      })
    })
  });
  describe("POST", () => {
    test("POST 201: Should add a new article based on a request body and return the article with the specified properties", () => {
      const articleBody = { author: "icellusedkars", title: "My test article", body: "This a test article.", topic: "cats"};
      return request(app)
      .post("/api/articles")
      .send(articleBody)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe("icellusedkars")
        expect(article.title).toBe("My test article")
        expect(article.body).toBe("This a test article.")
        expect(article.topic).toBe("cats")
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700")
        expect(article.article_id).toBe(14)
        expect(article.votes).toBe(0)
        expect(typeof article.created_at).toBe("string")
        expect(article.comment_count).toBe(0)
      })
    })
    test("POST 400: Should respond with a 400 error if the body provided does not contain the required content", () => {
      const articleBody = { author: "icellusedkars", body: "This a test article.", topic: "cats"};
      return request(app)
      .post("/api/articles")
      .send(articleBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid request: Object has incorrect properties")
      })
    })
  })
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET 200: Should return an array of comments for the given article ID with the required properties", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(2)
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(5);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });
    test("GET 200: Should return an array sorted by most recent comment first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSorted({ key: "created_at", descending: true });
        });
    });
    test("GET 200: Should return an empty array if the article has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
          expect(Array.isArray(comments)).toBe(true)
        });
    });
    test("GET 400: Should return a 400 'Invalid request' error if the article ID is of the incorrect type", () => {
      return request(app)
        .get("/api/articles/five/comments")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
    test("GET 404: Should return a 404 'Article ID not found' error if the article_id is valid but non-existent", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Article ID not found");
        });
    });
  });
  describe("POST", () => {
    test("POST 201: Inserts a new comment for the specified article ID and returns a comment object for the posted comment", () => {
      const commentToAdd = { username: "butter_bridge", body: "Test comment" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(commentToAdd)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.comment_id).toBe(19);
          expect(comment.body).toBe("Test comment");
          expect(comment.article_id).toBe(2);
          expect(comment.author).toBe("butter_bridge");
          expect(comment.votes).toBe(0);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("POST 404: Should return a 404 error if the comment object provided has incorrect properties", () => {
      const commentToAdd = { user: "butter_bridge", text: "Test comment" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe(
            "Invalid request: Object has incorrect properties"
          );
        });
    });
    test("POST 400: Should return a 400 'Invalid request' error if the article ID is of the incorrect type", () => {
      return request(app)
        .post("/api/articles/five/comments")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
    test("POST 400: Should return a 400 error if the username does not exist in the database", () => {
      const commentToAdd = { username: "fred", body: "Test comment" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe(
            "Invalid request: Specified value does not exist"
          );
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("DELETE 204: Deletes the specified comment by comment_id and returns status 204 with no content", () => {
      return request(app)
        .delete("/api/comments/5")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("DELETE 404: Should return a 404 error if the comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Comment ID not found");
        });
    });
    test("DELETE 400: Should return a 400 error if the comment_id is of the incorrect type", () => {
      return request(app)
        .delete("/api/comments/five")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
  });
  describe("PATCH", () => {
    test("PATCH 200: Should update the votes for a comment given the comment_id and respond with the updated comment", () => {
      const newVote = { inc_votes: 50 };
      return request(app)
        .patch("/api/comments/5")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.votes).toBe(50);
        });
    });

    test("PATCH 404: Should return a 404 'Comment ID not found' error if the comment ID is not in the database", () => {
      const newVote = { inc_votes: 50 };
      return request(app)
        .patch("/api/comments/9999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Comment ID not found");
        });
    });
    test("PATCH 400: Should return a 400 error if the vote object provided has an incorrect value", () => {
      const newVote = { inc_votes: "ten" };
      return request(app)
        .patch("/api/comments/5")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid request: Value has incorrect format");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("GET 200: Should respond with an array of users with their username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
    test("GET 404: Responds with an error if the endpoint is not found", () => {
      return request(app)
        .get("/api/users_endpoint")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Endpoint not found");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("GET 200: Should return a user by username", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(user.username).toBe("rogersop");
          expect(user.avatar_url).toBe(
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
          );
          expect(user.name).toBe("paul");
        });
    });
    test("GET 404: Should respond with a 404 error if the user is not found", () => {
      return request(app)
        .get("/api/users/fredsmith")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("User not found");
        });
    });
  });
});
