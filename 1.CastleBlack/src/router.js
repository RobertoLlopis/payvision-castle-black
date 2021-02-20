const { Router } = require("express");
const router = Router();

router.get("/health", function (req, res) {
  res.body = "Up and running";
  // QUESTION: why this endpoint blocks the app?
  //* It´s been define a response structure but not actually sending it.
});

module.exports = router;
