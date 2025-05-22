var express = require('express');
const db = require('../database');
var router = express.Router();
const {ParameterizedQuery: PQ} = require('pg-promise');

/* Función para validar usuario y contraseña */
router.post('/validar', async function(req, res, next) {
  try {
    const { usuario, clave_acceso } = req.body
    const findUsuario =  new PQ({text: `SELECT U.* FROM Usuario as U WHERE U.usuario = $1 AND U.clave_acceso = $2`, values: [usuario,clave_acceso]})
    const result = await db.oneOrNone(findUsuario);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al validar usuario y contraseña"})
  }
});

/* Función auxiliar para obtener el ROL al que pertenece un usuario */
router.post('/rol', async function(req, res, next) {
  try {
    const { id_usuario } = req.body
    const findRol =  new PQ({text: `SELECT obtener_rol_usuario($1);`, values: [id_usuario]})
    const result = await db.oneOrNone(findRol);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al validar rol"})
  }
});

/* Obtener todos los grupos para asignar a los estudiantes */
router.get('/grupos', async function(req, res, next) {
  
  try {
    const result = await db.any(`SELECT * FROM Grupos`);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener grupos de estudi"})
  }
  
});


router.get('/administradores', async function(req, res, next) {
  
  try {
    const result = await db.any(`SELECT U.*, P.* FROM Usuario AS U, Administrador as P WHERE id_usuario = id_admin`);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener administradores"})
  }
  
});

/* GET Administradores By ID - Obtener Datos de Admin y Usuario asociado mediante ID. */
router.get('/administradores/:id', async function(req, res, next) {
  
  try {
    const id_administrador = req.params.id
    const findAdministrador =  new PQ({text :`SELECT U.*, P.* FROM Usuario AS U, Administrador as P WHERE id_usuario = $1 AND id_usuario = id_administrador`, values: [id_administrador]});

    const result = await db.one(findAdministrador);
    console.log('Resultado:', result); // { value: 123 }
    return res.json(result)
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al obtener administrador"})
  }
  
});


router.post('/administradores', async function(req, res, next) {
  
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
    } = req.body

    const createUsuario = new PQ({text :`INSERT INTO Usuario (nombre, apellido, usuario,clave_acceso) VALUES ($1,$2,$3,$4) RETURNING *`, values: [nombre,apellido,usuario,clave_acceso]});
    
    const resultadoCreacionUsuario = await db.one(createUsuario);
    if (telefono != undefined && telefono != NULL && telefono !=''){
      const actualizarTelefono = new PQ({text :`UPDATE INTO Usuario SET telefono=$1  WHERE id_usuario=$2`, values: [telefono,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarTelefono);
    }
    if (correo != undefined && correo != NULL && correo !=''){
      const actualizarCorreo = new PQ({text :`UPDATE INTO Usuario SET correo=$1  WHERE id_usuario=$2`, values: [correo,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Email= await db.none(actualizarCorreo);
    }
    if (edad != undefined && edad != NULL && edad !=''){
      const actualizarEdad = new PQ({text :`UPDATE INTO Usuario SET edad=$1  WHERE id_usuario=$2`, values: [edad,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarEdad);
    }
    if (foto != undefined && foto != NULL && foto !=''){
      const actualizarFoto = new PQ({text :`UPDATE INTO Usuario SET foto=$1  WHERE id_usuario=$2`, values: [foto,resultadoCreacionUsuario.id_usuario]});
      const result_Up_Phone= await db.none(actualizarFoto);
    }
    

   
    console.log(resultadoCreacionUsuario)

    const findAdministrador =  new PQ({text :`INSERT INTO Administrador (id_admin) VALUES ($1)`, values: [resultadoCreacionUsuario.id_usuario]});
    const result = await db.none(findAdministrador);
    
    return res.json({mensaje: "El administrador ha sido creado con éxito"})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al crear administrador"})
  }
  
})

router.put('/administradores', async function(req, res, next) {
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
      id_administrador,
    } = req.body

    const updateUser = new PQ({text :`UPDATE Usuario SET nombre = $2, apellido = $3, clave_acceso = $4, usuario=$5, telefono=$6, cedula=$7, correo=$8, edad=$9, foto=$10 WHERE id_usuario = $1`, values: [id_usuario,nombre,apellido,clave_acceso, usuario, telefono, cedula, correo, edad, foto]});

    const resultUsuario = await db.none(updateUser);
    
    console.log('Resultado:', result); // { value: 123 }
    return res.json({mensaje: `El administrador con id: ${id_usuario} ha sido actualizado con éxito `})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al actualizar administrador"})
  }
  
});

router.delete('/administradores', async function(req, res, next) {
  try {
    const { id } = req.body
    const deleteAdministrador = new PQ({text :`DELETE FROM Usuario WHERE id_usuario = $1`, values: [id]});

    const result = await db.none(deleteAdministrador);
    console.log('Resultado:', result); // { value: 123 }
    return res.json({mensaje: `El administrador con id: ${id} ha sido eliminado con éxito `})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al eliminar administrador"})
  }
  
});





module.exports = router;
