const router = require("express").Router();

//Auth routes
router.post("/api/v1/auth/register", (req, res) => {
  return res.status(200).json({ message: "success" });
});

module.exports = router;
