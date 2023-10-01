const router = require("express").Router();
const { controllers: authController } = require("../api/v1/auth");

const API_Version = "/api/v1";

//Auth routes
router
  .post(`${API_Version}/auth/register`, authController.register)
  .post(`${API_Version}/auth/login`, authController.login);

//User routes
module.exports = router;
