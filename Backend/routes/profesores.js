var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');

/* GET Profesores - Obtener TODOS los profesores. */
router.get('/profesores', async function(req, res, next) {
  
  try {
    const result = await db.any(`SELECT U.*, P.* FROM Usuario AS U, Profesor as P WHERE id_usuario = id_profesor`);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesores"})
  }
  
});

/* GET Profesores By ID - Obtener Datos de Profesor y Usuario asociado mediante ID. */
router.get('/profesores/:id', async function(req, res, next) {
  
  try {
    const id_profesor = req.params.id
    const findProfesor =  new PQ({text :`SELECT U.*, P.* FROM Usuario AS U, Profesor as P WHERE id_usuario = $1 AND id_usuario = id_profesor`, values: [id_profesor]});

    const result = await db.one(findProfesor);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesor"})
  }
  
});

router.post('/profesores', async function(req, res, next) {
  
  try {
    
    const { 
      telefono,
      nombre,
      apellido,
      correo,
      edad,
      foto,
      usuario,
      clave_acceso,
      cedula,
      curriculum,
      formacion
    } = req.body

    const createUsuario = new PQ({text :`INSERT INTO Usuario (nombre, apellido, usuario,clave_acceso,formacion) VALUES ($1,$2,$3,$4) RETURNING *`, values: [nombre,apellido,usuario,clave_acceso]});
    
    const resultadoCreacionUsuario = await db.one(createUsuario);
    if (telefono != undefined && telefono != null && telefono !=''){
      const actualizarTelefono = new PQ({text :`UPDATE Usuario SET telefono=$1  WHERE id_usuario=$2`, values: [telefono,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarTelefono);
    }
    if (correo != undefined && correo != null && correo !=''){
      const actualizarCorreo = new PQ({text :`UPDATE Usuario SET correo=$1  WHERE id_usuario=$2`, values: [correo,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Email= await db.none(actualizarCorreo);
    }
    if (edad != undefined && edad != null && edad !=''){
      const actualizarEdad = new PQ({text :`UPDATE Usuario SET edad=$1  WHERE id_usuario=$2`, values: [edad,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarEdad);
    }
    if (foto != undefined && foto != null && foto !=''){
      const actualizarFoto = new PQ({text :`UPDATE Usuario SET foto=$1  WHERE id_usuario=$2`, values: [foto,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarFoto);
    }
    if (cedula != undefined && cedula != null && cedula !=''){
      const actualizarTelefono = new PQ({text :`UPDATE Usuario SET cedula=$1 WHERE id_usuario=$2`, values: [cedula,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarTelefono);
    }
    
   
    console.log(resultadoCreacionUsuario)

    const findProfesor =  new PQ({text :`INSERT INTO Profesor (id_profesor)  VALUES ($1) RETURNING *`, values: [resultadoCreacionUsuario.id_usuario]});
    const result = await db.one(findProfesor);
    
    if (curriculum != undefined && curriculum != null && curriculum !=''){
      const actualizarCV = new PQ({text :`UPDATE Profesor SET curriculum=$1 WHERE id_profesor=$2`, values: [curriculum,resultadoCreacionUsuario.id_profesor]});
      const result_Up_CV= await db.none(actualizarCV);
    }

    if (formacion != undefined && formacion != null && formacion !=''){
      const actualizarFormacion = new PQ({text :`UPDATE Profesor SET formacion = $1 WHERE id_profesor=$2`, values: [formacion,resultadoCreacionUsuario.id_usuario]});
      const result_Up_FFormacion= await db.none(actualizarFormacion);
    }

    return res.json({mensaje: "El profesor ha sido creado con éxito", id_usuario: resultadoCreacionUsuario.id_usuario})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al crear profesor"})
  }
  
})

router.put('/profesores', async function(req, res, next) {
  try {
    const { 
      id_usuario,
      telefono,
      nombre,
      apellido,
      correo,
      edad,
      foto,
      usuario,
      clave_acceso,
      cedula,
      id_profesor,
      curriculum,
      formacion
    } = req.body

    const updateUser = new PQ({text :`UPDATE Usuario SET nombre = $2, apellido = $3, clave_acceso = $4, usuario=$5, telefono=$6, cedula=$7, correo=$8, edad=$9, foto=$10 WHERE id_usuario = $1`, values: [id_usuario,nombre,apellido,clave_acceso, usuario, telefono, cedula, correo, edad, foto]});
    const updateProfesor = new PQ({text :`UPDATE Profesor SET curriculum = $2, formacion = $3 WHERE id_profesor = $1`, values: [id_usuario,curriculum,formacion]});

    const resultUsuario = await db.none(updateUser);
    const result = await db.none(updateProfesor);
    console.log('Resultado:', result); // { value: 123 }
    return res.json({mensaje: `El profesor con id: ${id_usuario} ha sido actualizado con éxito `})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al actualizar profesor"})
  }
  
});

router.delete('/profesores', async function(req, res, next) {
  try {
    const { id } = req.body
    const deleteProfesor = new PQ({text :`DELETE FROM Usuario WHERE id_usuario = $1`, values: [id]});

    const result = await db.none(deleteProfesor);
    console.log('Resultado:', result); // { value: 123 }
    return res.json({mensaje: `El profesor con id: ${id} ha sido eliminado con éxito `})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al eliminar profesor"})
  }
  
});

router.get('/profesores/cursos/faltantes/:id', async function(req, res, next) {

    try {
     const { id } = req.params
     const findCursos =  new PQ({text :`SELECT obtener_cursos_profesor($1)`, values: [id]});
     const result = await db.manyOrNone(findCursos);
     console.log('Resultado:', result); // { value: 123 }
     return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

router.get('/profesores/cursos/faltantes/:id/datos', async function(req, res, next) {

  try {
   const { id } = req.params
   const findCursos =  new PQ({text :`SELECT * FROM obtener_cursos_profesor($1)`, values: [id]});
   const result = await db.manyOrNone(findCursos);
   console.log('Resultado:', result); // { value: 123 }
   return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener profesores"})
  }
  
});

router.get('/profesores/cursos/inscritos/:id', async function(req, res, next) {

    try {
     const { id } = req.params
     const findCursos =  new PQ({text :`SELECT C.* FROM Curso AS C, Profesor_Curso AS PC WHERE C.id_curso = PC.id_curso AND PC.id_profesor = $1`, values: [id]});
     const result = await db.manyOrNone(findCursos);
     console.log('Resultado:', result); // { value: 123 }
     return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

router.get('/profesores/:id/horarios/', async function(req, res, next) {

    try {
     const { id } = req.params
     const findHorarios =  new PQ({text :`SELECT * FROM obtener_horarios_profesor($1)`, values: [id]});
     const result = await db.manyOrNone(findHorarios);
     console.log('Resultado:', result); // { value: 123 }
     return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener horarios de profesor"})
    }
    
});


router.get('/profesores/:id/horarios/curso/:id_curso', async function(req, res, next) {

  try {
   const { id,id_curso } = req.params
   const query = "SELECT Pr.id_profesor, U.nombre, U.apellido, Hp.id_curso, Cu.nombre_curso, Hp.id_horario, Gr.id_grupo, Gr.nombre_grupo, Hp.dia_semana, Hp.hora_inicio, Hp.hora_fin FROM Curso AS Cu, Usuario AS U, Profesor_curso AS Pc, Profesor AS Pr, Horarios_profesor AS Hp, Grupos AS Gr WHERE U.id_usuario = Pr.id_profesor AND Pc.id_profesor = Pr.id_profesor AND U.id_usuario = $1 AND Hp.id_profesor = Pr.id_profesor AND Hp.id_curso = Cu.id_curso AND Hp.id_grupo = Gr.id_grupo AND Pc.id_curso = Cu.id_curso AND Gr.id_curso = Cu.id_curso AND Cu.id_curso = $2";
   const findHorarios =  new PQ({text :query, values: [id,id_curso]});
   const result = await db.manyOrNone(findHorarios);
   console.log('Resultado:', result); // { value: 123 }
   return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener horarios de profesor"})
  }
  
});

router.post('/profesores/curso', async function(req, res, next) {
  
  try {
    
    const { 
    id_profesor,
    id_curso
    } = req.body

    const asignarCursoProfesor = new PQ({text :`INSERT INTO Profesor_curso (id_profesor, id_curso) VALUES ($1,$2) RETURNING *`, values: [id_profesor,id_curso]});
    const resultadoAsignarCursoProfesor = await db.one(asignarCursoProfesor);
    return res.json({mensaje: `El curso ${id_curso} ha sido asignado al profesor ${id_profesor}`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al crear profesor"})
  }
  
})

router.delete('/profesores/:id_profesor/curso/:id_curso/eliminar', async function(req, res, next) {
  
  try {
    
    const { 
    id_profesor,
    id_curso
    } = req.params

    const asignarCursoProfesor = new PQ({text :`DELETE FROM Profesor_Curso WHERE id_profesor = $1 AND id_curso = $2`, values: [id_profesor,id_curso]});
    const resultadoAsignarCursoProfesor = await db.none(asignarCursoProfesor);
    return res.json({mensaje: `El curso ${id_curso} dictado por el profesor ${id_profesor} ha sido eliminado`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al crear profesor"})
  }
  
})


router.post('/profesores/agregar/horario/curso', async function(req, res, next) {
  
  try {
    
    const { 
    id_profesor,
    id_curso,
    id_grupo,
    dia_semana,
    hora_inicio,
    hora_fin
    } = req.body

    const asignarHorarioProfesor = new PQ({text :`INSERT INTO horarios_profesor (id_profesor, id_curso, id_grupo,dia_semana,hora_inicio,hora_fin) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, values: [id_profesor,id_curso,id_grupo,dia_semana,hora_inicio,hora_fin]});
    const resultadoAsignarCursoProfesor = await db.one(asignarHorarioProfesor);
    return res.json({mensaje: `El curso ${id_curso} ha sido asignado al profesor ${id_profesor}`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.status(404).json({menssage: "Error al crear profesor"})
  }
  
})

router.delete('/profesores/eliminar/horario/curso', async function(req, res, next) {
  
  try {
    
    const { 
      id_horario
    } = req.body

    const asignarHorarioProfesor = new PQ({text :`DELETE FROM Horarios_profesor WHERE id_horario = $1`, values: [id_horario]});
    const resultadoAsignarCursoProfesor = await db.none(asignarHorarioProfesor);
    return res.json({mensaje: `El horario ${id_horario} ha sido eliminado al profesor`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.status(404).json({menssage: "Error al crear profesor"})
  }
  
})

router.put('/profesores/editar/horario/curso', async function(req, res, next) {
  
  try {
    
    const { 
      id_horario,
      id_grupo,
      dia_semana,
      hora_inicio,
      hora_fin
    } = req.body

    const asignarHorarioProfesor = new PQ({text :`UPDATE Horarios_profesor SET id_grupo = $2, dia_semana = $3, hora_inicio = $4, hora_fin = $5 WHERE id_horario = $1`, values: [id_horario,id_grupo,dia_semana,hora_inicio,hora_fin]});
    const resultadoAsignarCursoProfesor = await db.none(asignarHorarioProfesor);
    return res.json({mensaje: `El horario ${id_horario} ha sido actualizado`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.status(404).json({menssage: "Error al crear profesor"})
  }
  
})


  module.exports = router;