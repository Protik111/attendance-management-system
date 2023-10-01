const tokenService = require("../lib/token");
const userService = require("../lib/user");
const { authenticationError } = require("../utils/error");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = tokenService.decodeToken({ token });
    const user = userService.findUserByEmail(decoded?.email);

    if (!user) {
      next(authenticationError());
    }

    if (user.status !== "approved") {
      next(authenticationError(`Your account is ${user.status}`));
    }

    req.user = { ...user._doc, id: user.id };
    next();
  } catch (error) {
    next(authenticationError());
  }
};

module.exports = authenticate;
