const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should return the payload with valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  });
});
