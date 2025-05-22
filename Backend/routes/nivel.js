var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');

/* Obtener todos los niveles que ha jugado un usuario  */
router.get('/niveles/usuario/:id_usuario', async function(req, res, next) {
  
  try {
    const {id_usuario} = req.params
    const encontrarNiveles =  new PQ({text :`SELECT usuario_nivel.* FROM usuario_nivel WHERE usuario_nivel.id_usuario = $1`, values: [id_usuario]});
    const result = await db.manyOrNone(encontrarNiveles);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesores"})
  }
  
});

/* Cargar nivel jugado de usuario */
router.post('/niveles/:id_nivel/usuario/:id_usuario/agregar/estatus/:estatus', async function(req, res, next) {
  
  try {
    const {id_usuario,id_nivel,estatus} = req.params
    const encontrarNiveles =  new PQ({text :`INSERT INTO usuario_nivel (id_usuario,id_nivel,estatus) VALUES ($1,$2,$3)`, values: [id_usuario,id_nivel,estatus]});
    const result = await db.none(encontrarNiveles);
    return res.json({mensaje: "Nivel cargado con éxito"})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesores"})
  }
  
});

/* Modificar nivel jugado de usuario */
router.put('/niveles/:id_nivel/usuario/:id_usuario/modificar/estatus/:estatus', async function(req, res, next) {
  
  try {
    const {id_usuario,id_nivel,estatus} = req.params
    const encontrarNiveles =  new PQ({text :`UPDATE usuario_nivel SET estatus = $3 WHERE id_usuario = $1 AND id_nivel = $2`, values: [id_usuario,id_nivel,estatus]});
    const result = await db.none(encontrarNiveles);
    return res.json({mensaje: "Nivel modificado con éxito"})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesores"})
  }
  
});
 module.exports = router;