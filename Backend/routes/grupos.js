var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');


//Obtener todos los grupos de alumnos
router.get('/grupos', async function(req, res, next) {

    try {
     const findGrupos =  new PQ({text :`SELECT * FROM Grupos`});
     const result = await db.manyOrNone(findGrupos);
     console.log('Resultado:', result); // { value: 123 }
     return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener todos los grupos de alumnos
router.get('/grupos/:id', async function(req, res, next) {

    try {
    const { id } =req.params
    const findGrupos =  new PQ({text :`SELECT * FROM Grupos WHERE id_grupo = ${id}`});
     const result = await db.oneOrNone(findGrupos);
     console.log('Resultado:', result); // { value: 123 }
     return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener la información del grupo de un estudiante dado
router.get('/grupos/estudiante/:id', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT E.id_estudiante, U.nombre, U.apellido, G.*, Cu.nombre_curso FROM Grupos AS G, Curso AS Cu, Estudiante AS E, Usuario AS U WHERE E.id_estudiante = $1 AND U.id_usuario = E.id_estudiante AND E.id_grupo = G.id_grupo AND G.id_curso = Cu.id_curso";
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.oneOrNone(findGrupo);
        console.log('Resultado:', result); // { value: 123 }

        if(result !== null){
            const profesor_query = "SELECT Pr.id_profesor, U.nombre, U.apellido, Cu.nombre_curso, Hp.*,Gr.nombre_grupo FROM Curso AS Cu, Usuario AS U, Profesor_curso AS Pc, Profesor AS Pr, Grupos AS Gr, Horarios_profesor AS Hp WHERE Cu.id_curso = $1 AND Gr.id_grupo = $2 AND Hp.id_grupo = Gr.id_grupo AND U.id_usuario = Pr.id_profesor AND Pc.id_profesor = Pr.id_profesor AND Pc.id_curso = Cu.id_curso AND Hp.id_profesor = Pc.id_profesor AND Hp.id_curso = Cu.id_curso"
            const findInformacionGrupo =  new PQ({text: profesor_query, values: [result.id_curso, result.id_grupo]});
            const resultInformacion = await db.manyOrNone(findInformacionGrupo);
    
            result.informacionGrupo = resultInformacion;
        }
        
        console.log('Informacion Grupo:', result); // { value: 123 }
        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener la información del grupo que ve un curso dado con su informacion de profesor
router.get('/grupos/:id/curso', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Pr.id_profesor, U.nombre, U.apellido, Hp.id_curso, Cu.nombre_curso, Hp.id_horario, Gr.id_grupo, Gr.nombre_grupo, Hp.dia_semana, Hp.hora_inicio, Hp.hora_fin FROM Curso AS Cu, Usuario AS U, Profesor_curso AS Pc, Profesor AS Pr, Horarios_profesor AS Hp, Grupos AS Gr WHERE U.id_usuario = Pr.id_profesor AND Pc.id_profesor = Pr.id_profesor AND Hp.id_profesor = Pr.id_profesor AND Hp.id_curso = Cu.id_curso AND Hp.id_grupo = Gr.id_grupo AND Pc.id_curso = Cu.id_curso AND Gr.id_curso = Cu.id_curso AND Gr.id_grupo = $1";        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener la información del grupo que ve un curso dado con su informacion de profesor
router.get('/grupos/:id/curso/sin/horario', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Pr.id_profesor, U.nombre, U.apellido, Cu.id_curso, Cu.nombre_curso, Gr.id_grupo, Gr.nombre_grupo FROM Curso AS Cu, Usuario AS U, Profesor_curso AS Pc, Profesor AS Pr, Grupos AS Gr WHERE U.id_usuario = Pr.id_profesor AND Pc.id_profesor = Pr.id_profesor AND Pc.id_curso = Cu.id_curso AND Gr.id_curso = Cu.id_curso AND Gr.id_grupo = $1";        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener Todos los Estudiantes de un grupo Dado
router.get('/grupos/:id/estudiantes', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Us.*, Est.id_grupo FROM Estudiante AS Est, Grupos AS Gr, Usuario AS Us WHERE Est.id_grupo = Gr.id_grupo AND Est.id_estudiante = Us.id_usuario AND Gr.id_grupo = $1";        
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"}) 
    }
    
});

//Obtener Todos los grupos que NO están incritos en un curso dado
router.get('/grupos/curso/:id/faltantes', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Gr.* FROM Grupos AS Gr WHERE Gr.id_curso != $1";        
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener Todos los grupos que NO están incritos en un curso dado
router.put('/curso/asignar/grupo', async function(req, res, next) {

    try {
        const { id_grupo, id_curso } = req.body  
        const query = "UPDATE Grupos SET id_curso = $2 WHERE id_grupo = $1";        
        const findGrupo =  new PQ({text: query, values: [id_grupo,id_curso]});
        const result = await db.manyOrNone(findGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al obtener profesores"})
    }
    
});

//Obtener Todos los grupos que NO están incritos en un curso dado
router.post('/grupos', async function(req, res, next) {

    try {
        const { nombre_grupo,id_curso,id_profesor_grupo } = req.body  
        const query = "INSERT INTO GRUPOS (nombre_grupo,id_curso,id_profesor_grupo) VALUES ($1,$2,$3) RETURNING *";        
        const crearGrupo =  new PQ({text: query, values: [nombre_grupo,id_curso,id_profesor_grupo]});
        const result = await db.oneOrNone(crearGrupo);
        console.log('Resultado:', result);

        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});


router.delete('/grupos/:id', async function(req, res, next) {

    try {
    const { id } =req.params
    const findGrupos =  new PQ({text :`DELETE FROM Grupos WHERE id_grupo = ${id}`});
     const result = await db.none(findGrupos);
     return res.json({mensaje: "Grupo eliminado correctamente"})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

router.put('/grupos', async function(req, res, next) {

    try {
        const { nombre_grupo, id_grupo } = req.body  
        const query = "UPDATE Grupos SET nombre_grupo = $2 WHERE id_grupo = $1";        
        const findGrupo =  new PQ({text: query, values: [id_grupo,nombre_grupo]});
        const result = await db.none(findGrupo);

        return res.json({mensaje: "Grupo actualizado con éxito"})

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});

router.get('/grupos/profesores/:id', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Us.* FROM Usuario AS Us, Profesor AS Pr, Grupos AS Gr WHERE Gr.id_profesor_grupo = Pr.id_profesor AND Us.id_usuario = Pr.id_profesor AND Gr.id_grupo = $1";      
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);

        return res.json(result)

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});

router.get('/grupos/estudiantes/:id', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Us.* FROM Usuario AS Us, Estudiante AS Est, Grupos AS Gr WHERE Gr.id_grupo = Est.id_grupo AND Us.id_usuario = Est.id_estudiante AND Gr.id_grupo = $1";  
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.manyOrNone(findGrupo);

        return res.json(result)

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});


router.get('/grupos/curso/:id', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "SELECT Cu.* FROM Grupos AS Gr, Curso AS Cu WHERE Gr.id_grupo = $1 AND Gr.id_curso = Cu.id_curso";
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.oneOrNone(findGrupo);

        return res.json(result)

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});

/* Eliminar Grupo de Un estudiante */
router.delete('/grupos/estudiante/:id/eliminar', async function(req, res, next) {

    try {
        const { id } = req.params  
        const query = "UPDATE Estudiante SET id_grupo = NULL WHERE id_estudiante = $1";
        const findGrupo =  new PQ({text: query, values: [id]});
        const result = await db.none(findGrupo);

        return res.json({mensaje: "El estudiante ha sido eliminado del grupo"})

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});


/* Agregar Grupo de Un estudiante */
router.post('/grupos/estudiante/:id/agregar/:id_grupo', async function(req, res, next) {

    try {
        const { id,id_grupo } = req.params  
        const query = "UPDATE Estudiante SET id_grupo = $2 WHERE id_estudiante = $1";
        const findGrupo =  new PQ({text: query, values: [id,id_grupo]});
        const result = await db.none(findGrupo);

        return res.json({mensaje: "El estudiante ha sido agregado del grupo"})

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});

/* Editar Grupo de Un estudiante */
router.put('/grupos/estudiante/:id/editar/:id_grupo', async function(req, res, next) {

    try {
        const { id,id_grupo } = req.params  
        const query = "UPDATE Estudiante SET id_grupo = $2 WHERE id_estudiante = $1";
        const findGrupo =  new PQ({text: query, values: [id,id_grupo]});
        const result = await db.none(findGrupo);

        return res.json({mensaje: "El estudiante ha sido reasignado"})

    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al crear grupo"})
    }
    
});


/* Obtener información de profesor que le da clases a un grupo dado */




module.exports = router;