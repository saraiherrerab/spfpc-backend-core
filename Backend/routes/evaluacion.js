var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');


router.put('/estudiantes/establecer/notas', async function(req, res, next) {
    try {
        const { 
            id_estudiante,
            eficiencia_algoritmica,
            reconocimiento_patrones,
            identificacion_errores,
            abstraccion,
            asociacion,
            construccion_algoritmos,
            p_actividades_completadas,
            tipo_premiacion
        } = req.body

    console.log(req.body)
  
     const updateEstudiante = new PQ(
        {
            text :`UPDATE Estudiante SET eficiencia_algoritmica = $2, reconocimiento_patrones = $3, identificacion_errores = $4, abstraccion=$5, asociacion=$6, construccion_algoritmos=$7, p_actividades_completadas=$8, tipo_premiacion=$9 WHERE id_estudiante = $1`, 
            values: [
                id_estudiante,
                eficiencia_algoritmica,
                reconocimiento_patrones,
                identificacion_errores,
                abstraccion,
                asociacion,
                construccion_algoritmos,
                p_actividades_completadas,
                tipo_premiacion
            ]
        }
    );
      const resultEstudiante = await db.none(updateEstudiante);
      return res.json({mensaje: `El estudiante con id: ${id_estudiante} ha sido actualizado con éxito `})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al actualizar estudiante"})
    }
    
});

module.exports = router;