const express = require('express');
const router = express.Router();

// Controladores
const obtenerPedidos = require('../controllers/pedidos/obtenerPedido');
const actualizarPedidos = require('../controllers/pedidos/actualizarPedido');
const crearPedido = require('../controllers/pedidos/crearPedido'); // 👈 nuevo

// Rutas
router.get('/', obtenerPedidos);
router.put('/:id/estado', actualizarPedidos);
router.post('/', crearPedido); // 👈 importante

module.exports = router;
