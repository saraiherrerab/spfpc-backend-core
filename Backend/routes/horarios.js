var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');


/* Obtener todos los horarios en el sistema  */
router.get('/horarios', async function(req, res, next) {
  
    try {
      const result = await db.any(`SELECT * FROM horarios_grupo`);
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener todos los horarios en el sistema"})
    }
    
});

/* Obtener un horario en especifico  */
router.get('/horarios/:id', async function(req, res, next) {
  
    try {
      const { id } = req.params
      const obtenerHorarioPorId =  new PQ({text :`SELECT * FROM horarios_grupo WHERE id_horario = $1`,values: [id]});
      const result = await db.none(obtenerHorarioPorId);
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener el horario de id: " + id})
    }
    
});

/* Agregar una serie de horarios a un grupo en particular  */
router.post('/horarios/grupo/agregar', async function (req, res) {
  try {
    const { id_grupo, arregloHorarios } = req.body;

    // Validación básica
    if (!id_grupo || !Array.isArray(arregloHorarios) || arregloHorarios.length === 0) {
      return res.status(400).json({ mensaje: "Datos inválidos: asegúrate de enviar id_grupo y un arreglo de horarios" });
    }

    // Insertar cada horario usando for...of
    for (const horario of arregloHorarios) {
      const crearHorarioParaGrupo = new PQ({
        text: `INSERT INTO horarios_grupo(id_grupo, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)`,
        values: [id_grupo, horario.dia_semana, horario.hora_inicio, horario.hora_fin]
      });

      await db.none(crearHorarioParaGrupo);
    }

    return res.json({ mensaje: "Los horarios han sido creados exitosamente" });
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    return res.status(500).json({ mensaje: `Error al guardar los horarios para el grupo ${req.body.id_grupo}` });
  }
});

/* Obtener los horarios de un grupo especifico  */
router.get('/horarios/grupo/:id', async function(req, res, next) {
  
    try {
      const { id } = req.params
      const obtenerHorariosPorIdGrupo =  new PQ({text :`SELECT * FROM horarios_grupo WHERE id_grupo = $1`,values: [id]});
      const result = await db.manyOrNone(obtenerHorariosPorIdGrupo);
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener el horario de id: " + id})
    }
    
});

/* Agregar una seria de horarios a un grupo en particular  */
router.put('/horarios/grupo/modificar', async function (req, res) {
  try {
    const { id_grupo, arregloHorarios } = req.body;

    // Validación básica
    if (!id_grupo || !Array.isArray(arregloHorarios) || arregloHorarios.length === 0) {
      return res.status(400).json({ mensaje: "Datos inválidos: asegúrate de enviar id_grupo y un arreglo de horarios" });
    }

    // Insertar cada horario usando for...of
    for (const horario of arregloHorarios) {
      const actualizarHorarioParaGrupo = new PQ({
        text: `UPDATE horarios_grupo SET dia_semana = $2, hora_inicio = $3, hora_fin = $4 WHERE id_horario = $1`,
        values: [horario.id_horario, horario.dia_semana, horario.hora_inicio, horario.hora_fin]
      });

      await db.none(actualizarHorarioParaGrupo);
    }

    return res.json({ mensaje: "Los horarios han sido actualizados exitosamente" });
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    return res.status(500).json({ mensaje: `Error al guardar los horarios para el grupo ${req.body.id_grupo}` });
  }
});

/* Obtener horarios de profesor */

router.get('/horarios/profesor/:id', async function(req, res, next) {
  
    try {
      const { id } = req.params
      const obtenerHorariosProfesor =  new PQ({text :`SELECT Hor.* FROM horarios_grupo AS Hor, Grupos AS Gr WHERE Hor.id_grupo = Gr.id_grupo AND Gr.id_profesor_grupo = $1`,values: [id]});
      const result = await db.manyOrNone(obtenerHorariosProfesor);
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener el horario de id: " + id})
    }
    
});

module.exports = router;
  