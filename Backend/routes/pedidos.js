const express = require('express');
const router = express.Router();

const obtenerPedidos = require('../controllers/pedidos/obtenerPedido');
const actualizarPedidos = require('../controllers/pedidos/actualizarPedido');

router.get('/', obtenerPedidos);
router.put('/:id/estado', actualizarPedidos);

module.exports = router;
