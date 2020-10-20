let server;
const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await Genre.collection.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy;
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy;
    });
  });

  describe("GET /:id", () => {
    let genre;

    beforeEach(async () => {
      genre = {
        _id: mongoose.Types.ObjectId(),
        name: "genre1",
      };
      await Genre.collection.insertOne(genre);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/5`);
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });

    it("should return a genre if valid id is passed", async () => {
      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${genre._id}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
      token = new User(user).generateAuthToken();
      genre = { _id: mongoose.Types.ObjectId(), name: "genre1" };
      await Genre.collection.insertOne(genre);
    });

    it("should return 404 if id is invalid", async () => {
      genre._id = "1234";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user does not have permission to access resource", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if genre id is not exist", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return deleted genre", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /:id", () => {
    let token;
    let genre;

    const exec = () => {
      return request(server)
        .put(`/api/genres/${genre._id}`)
        .set("x-auth-token", token)
        .send({ name: genre.name });
    };

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = { name: "genre1" };
      await Genre.collection.insertOne(genre);
    });

    it("should return 404 if id is invalid", async () => {
      genre._id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user does not have permission to access resource", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      genre.name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      genre.name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if genre id is not exist", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return updated genre", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
