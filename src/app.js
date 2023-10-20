const express = require("express");
const applyMiddleware = require("./middleware");
const router = require("./routes/index");

const app = express();
applyMiddleware(app);
app.use(router);

app.get("/health", (req, res) => {
  res.status(200).json({
    health: "Ok",
    user: req.user,
  });
});

app.use((err, _req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
