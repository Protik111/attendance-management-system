const router = require("express").Router();
const { controllers: authController } = require("../api/v1/auth");
const { controllers: userController } = require("../api/v1/user");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const API_version1 = "/api/v1";

//Auth routes
router
  .post(`${API_version1}/auth/register`, authController.register)
  .post(`${API_version1}/auth/login`, authController.login);

//User routes
router
  .post(`${API_version1}/user/create-user`, authenticate, authorize(["admin"]), userController.create)
  .patch(`${API_version1}/user/approve/:id`, authenticate, authenticate(["admin"]), userController.approve)
module.exports = router;
