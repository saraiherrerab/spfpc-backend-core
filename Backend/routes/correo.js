var express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga las variables de entorno del archivo .env
var router = express.Router();
const db = require('../database');
const {ParameterizedQuery: PQ} = require('pg-promise');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo de Gmail
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de Gmail
    }
});

console.log('Transporter configurado con el usuario:', process.env.EMAIL_USER);

// 4. Ruta para enviar el correo
router.post('/enviar-correo', (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).send('Faltan los campos "to", "subject" o "text" en el cuerpo de la solicitud.');
    }

    // Opciones del correo
    const mailOptions = {
        from: `"Tu App Increíble" <${process.env.EMAIL_USER}>`, // Dirección del remitente
        to: to,                      // Lista de destinatarios
        subject: subject,            // Asunto del correo
        text: text,                  // Cuerpo del correo en texto plano
        // html: '<b>Hello world?</b>' // También puedes enviar HTML
    };

    // 5. Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send(error.toString());
        }
        console.log('Correo enviado con éxito:', info.response);
        res.status(200).send('Correo enviado: ' + info.response);
    });
});

router.get('/usuario/correo/:correo', async (req, res) => {

    try {
        const { correo } = req.params
        const query = "SELECT Us.* FROM Usuario AS Us WHERE Us.correo = $1";
        const obtenerProfesoresCurso = new PQ({text : query, values: [correo]});
        const result = await db.oneOrNone(obtenerProfesoresCurso);
        return res.json(result)
    } catch (error) {
        console.error('Error al hacer la consulta:', error);
        res.json({menssage: "Error al eliminar estudiante"})
    }

});

router.put('/usuario/cambiar/clave', async (req, res) => {

  try {
    const { 
      id_usuario,
      clave_acceso
    } = req.body

    const updateUser = new PQ({text :`UPDATE Usuario SET clave_acceso = $2 WHERE id_usuario = $1`, values: [id_usuario,clave_acceso]});

    const resultUsuario = await db.none(updateUser);
    
    console.log('Resultado:', result); // { value: 123 }
    return res.json({mensaje: `La contraseña de usuario fue cambiada exitosamente`})
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
    res.json({menssage: "Error al actualizar administrador"})
  }
  
});



module.exports = router;