const express = require("express");
const router = express.Router();

const obtenerSucursalMasCercana = require("../controllers/sucursales/obtenerSucursalMasCercana");

router.post("/nearest", obtenerSucursalMasCercana);

module.exports = router;
