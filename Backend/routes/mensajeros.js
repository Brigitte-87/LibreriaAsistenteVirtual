const express = require("express");
const router = express.Router();
const { getMensajeros } = require("../controllers/mensajeros/mensajeros");

router.get("/", getMensajeros);

module.exports = router;
