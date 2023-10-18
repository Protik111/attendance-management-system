const router = require("express").Router();
const { controllers: authController } = require("../api/v1/auth");
const { controllers: userController } = require("../api/v1/user");
const { controllers: attendanceController } = require("../api/v1/attendance");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const API_version1 = "/api/v1";

//Auth routes
router
  .post(`${API_version1}/auth/register`, authController.register)
  .post(`${API_version1}/auth/login`, authController.login);

//User routes
router
  .post(
    `${API_version1}/user/create-user`,
    authenticate,
    authorize(["admin"]),
    userController.create
  )
  .patch(
    `${API_version1}/user/approve/:id`,
    authenticate,
    authorize(["admin"]),
    userController.approve
  );

//Attendance route
/**
 * @todo: Add base URL version in /attendances route
 */
router
  .get(`/attendances`, authenticate, attendanceController.view)
  .post(
    `${API_version1}/attendance/create`,
    authenticate,
    attendanceController.create
  )
  .patch(
    `${API_version1}/attendance/stop/:id`,
    authenticate,
    attendanceController.stop
  )
  .post(
    `${API_version1}/attendance/off`,
    authenticate,
    attendanceController.dayOff
  );

module.exports = router;
