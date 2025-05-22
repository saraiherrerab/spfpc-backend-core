var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');
router.get('/estudiantes', async function(req, res, next) {
  
    try {
      const result = await db.any(`SELECT U.*, P.* FROM Usuario AS U, Estudiante as P WHERE id_usuario = id_estudiante`);
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener estudiantes"})
    }
    
});
  
  /* GET Estudiantes By ID - Obtener Datos de Estudiante y Usuario asociado mediante ID. */
router.get('/estudiantes/:id', async function(req, res, next) {
    
    try {
      const id_estudiante = req.params.id
      const findEstudiante =  new PQ({text :`SELECT U.*, P.* FROM Usuario AS U, Estudiante as P WHERE id_usuario = $1 AND id_usuario = id_estudiante`, values: [id_estudiante]});
  
      const result = await db.one(findEstudiante);
      console.log('Resultado:', result); // { value: 123 }
      return res.json(result)
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesor"})
    }
    
});
  
  
router.post('/estudiantes', async function(req, res, next) {
    
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
        condicion_medica,
        id_grupo 
      } = req.body
  
      console.log("RECIBIENDO DEL BODY")
      console.log(req.body)
  
      const createUsuario = new PQ({text :`INSERT INTO Usuario (nombre, apellido, usuario,clave_acceso) VALUES ($1,$2,$3,$4) RETURNING *`, values: [nombre,apellido,usuario,clave_acceso]});
      
      const resultadoCreacionUsuario = await db.one(createUsuario);
      console.log("RESULTADO DE CREAR USUARIO")
      console.log(resultadoCreacionUsuario)
  
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
        const actualizarCedula = new PQ({text :`UPDATE Usuario SET cedula=$1  WHERE id_usuario=$2`, values: [cedula,resultadoCreacionUsuario.id_usuario]});
        const result_Up_Phone= await db.none(actualizarCedula);
      }
      if (condicion_medica != undefined && condicion_medica != null && condicion_medica !=''){
        const actualizarCM = new PQ({text :`UPDATE Estudiante SET condicion_medica=$1  WHERE id_estudiante=$2`, values: [condicion_medica,resultadoCreacionUsuario.id_estudiante]});
        const result_Up_CM= await db.none(actualizarCM);
      }
  
      const findEstudiante =  new PQ({text :`INSERT INTO Estudiante (id_estudiante,condicion_medica,id_grupo) VALUES ($1,$2,$3)`, values: [resultadoCreacionUsuario.id_usuario,condicion_medica,id_grupo]});
      const result = await db.none(findEstudiante);
      
      return res.json({mensaje: "El estudiante ha sido creado con éxito", id_usuario: resultadoCreacionUsuario.id_usuario})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: error})
    }
    
})
  
router.put('/estudiantes', async function(req, res, next) {
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
        id_estudiante,
        condicion_medica
      } = req.body
  
      const updateUser = new PQ({text :`UPDATE Usuario SET nombre = $2, apellido = $3, clave_acceso = $4, usuario=$5, telefono=$6, cedula=$7, correo=$8, edad=$9, foto=$10 WHERE id_usuario = $1`, values: [id_usuario,nombre,apellido,clave_acceso, usuario, telefono, cedula, correo, edad, foto]});
      const updateProfesor = new PQ({text :`UPDATE Estudiante SET condicion_medica = $2 WHERE id_estudiante = $1`, values: [id_usuario,condicion_medica]});
  
      const resultUsuario = await db.none(updateUser);
      const result = await db.none(updateProfesor);
      console.log('Resultado:', result); // { value: 123 }
      return res.json({mensaje: `El estudiante con id: ${id_usuario} ha sido actualizado con éxito `})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al actualizar estudiante"})
    }
    
});
  
router.delete('/estudiantes', async function(req, res, next) {
    try {
      const { id } = req.body
      const deleteEstudiante = new PQ({text :`DELETE FROM Usuario WHERE id_usuario = $1`, values: [id]});
  
      const result = await db.none(deleteEstudiante);
      console.log('Resultado:', result); // { value: 123 }
      return res.json({mensaje: `El estudiante con id: ${id} ha sido eliminado con éxito `})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al eliminar estudiante"})
    }
    
});
//Obtener todos los grupos de alumnos
router.put('/estudiantes/asignar/grupo', async function(req, res, next) {
    try {
    const {id_estudiante, id_grupo} = req.body
    console.log(req.body)
     const updateGrupoEstudiante =  new PQ({text :`UPDATE Estudiante SET id_grupo = $2 WHERE id_estudiante = $1`,values: [id_estudiante,id_grupo]});
     const result = await db.none(updateGrupoEstudiante);
     console.log('Resultado:', result); // { value: 123 }
     return res.json({mensaje: "El estudiante ha sido asignado al grupo de forma exitosa"})
    } catch (error) {
      console.error('Error al hacer la consulta:', error);
      res.json({menssage: "Error al obtener profesores"})
    }
    
});

module.exports = router;