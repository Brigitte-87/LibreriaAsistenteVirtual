const conexion = require('../../db');

const actualizarPedido = (req, res) => {
  const { id } = req.params;
  const { estado, id_mensajero } = req.body;

  if (estado === undefined || isNaN(estado)) {
    return res.status(400).json({ mensaje: 'Estado inválido o faltante' });
  }

  let sql, params;

  if (id_mensajero !== undefined && id_mensajero !== null) {
    sql = `
      UPDATE pedidos
      SET estado = ?, id_mensajero = ?
      WHERE id_pedido = ?
    `;
    params = [estado, id_mensajero, id];
  } else {
    sql = `
      UPDATE pedidos
      SET estado = ?
      WHERE id_pedido = ?
    `;
    params = [estado, id];
  }

  conexion.query(sql, params, (error, resultado) => {
    if (error) {
      console.error('Error al actualizar el pedido:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    console.log(
      id_mensajero
        ? `Pedido ${id} actualizado a estado ${estado} con mensajero ${id_mensajero}`
        : `Pedido ${id} actualizado a estado ${estado}`
    );

    res.json({
      mensaje: 'Pedido actualizado correctamente',
      id,
      estado,
      id_mensajero: id_mensajero || null,
    });
  });
};

module.exports = actualizarPedido;
