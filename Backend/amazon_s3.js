const { S3Client,GetObjectCommand  } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const multerS3 = require('multer-s3');
const multer = require('multer'); // No olvides este
var express = require('express');
var router = express.Router();
const db = require('./database');
const {ParameterizedQuery: PQ} = require('pg-promise');
router.use(express.urlencoded({ extended: true })); // Para form-data tradicional

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_USER_CREDENTIAL = process.env.AWS_USER_CREDENTIAL;
const AWS_PASSWORD_CREDENTIAL = process.env.AWS_PASSWORD_CREDENTIAL;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const S3_CLIENT = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_USER_CREDENTIAL,
        secretAccessKey: AWS_PASSWORD_CREDENTIAL
    }
})
  

  router.post('/cargar/archivo/imagen', (req, res) => {
    const storage = multerS3({
        s3: S3_CLIENT,
        bucket: AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
          const originalName = file.originalname;
          const filename = `imagenes/${originalName}`; // Ejemplo usando userId y UUID
          cb(null, filename);
        },
    });
    
    const upload = multer({ storage }).single('archivo');
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ mensaje: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ mensaje: 'No se recibió ningún archivo.' });
      }
  
      const { id_usuario } = req.body;

      const findCursos =  new PQ({text :`UPDATE USUARIO SET foto = $2 WHERE id_usuario = $1`, values: [id_usuario,req.file.location]});
      const result = await db.none(findCursos);
  

      res.json({
        mensaje: 'Archivo subido correctamente a S3',
        archivo: {
          nombre: req.file.key,
          url: req.file.location
        },
        datos_usuario: {
          id_usuario
        }
      });
    });
  });

  
  router.get('/descargar/imagen/:key', async (req, res) => {
    const { key } = req.params;
  
    if (!key) {
      return res.status(400).json({ mensaje: 'Se requiere la clave del archivo para la descarga.' });
    }
  
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: "imagenes/"+key,
    };
  
    const command = new GetObjectCommand(params);
  
    try {
      const response = await S3_CLIENT.send(command);
  
      if (!response.Body) {
        return res.status(404).json({ mensaje: 'El archivo no se encontró en S3.' });
      }
  
      // Establece los encabezados de respuesta
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename="${key}"`);
  
      // Envía el cuerpo del archivo como un stream
      response.Body.pipe(res);
  
    } catch (error) {
      console.error('Error al descargar el archivo desde S3:', error);
      if (error.$metadata && error.$metadata.httpStatusCode === 404) {
        return res.status(404).json({ mensaje: 'El archivo no se encontró en S3.', encontrado: false });
      }
      res.status(500).json({ mensaje: 'Error al descargar el archivo desde S3.' });
    }
  });

  /****************************************************/

  router.post('/cargar/archivo/pdf', (req, res) => {
    const storage = multerS3({
        s3: S3_CLIENT,
        bucket: AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
          const originalName = file.originalname;
          const filename = `curriculum/${originalName}`; // Ejemplo usando userId y UUID
          cb(null, filename);
        },
    });
    
    const upload = multer({ storage }).single('archivo');
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ mensaje: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ mensaje: 'No se recibió ningún archivo.' });
      }
  
      const { id_usuario } = req.body;

      const findCursos =  new PQ({text :`UPDATE Profesor SET curriculum = $2 WHERE id_profesor = $1`, values: [id_usuario,req.file.location]});
      const result = await db.none(findCursos);
  

      res.json({
        mensaje: 'Archivo subido correctamente a S3',
        archivo: {
          nombre: req.file.key,
          url: req.file.location
        },
        datos_usuario: {
          id_usuario
        }
      });
    });
  });

  
  router.get('/descargar/pdf/:key', async (req, res) => {
    const { key } = req.params;
  
    if (!key) {
      return res.status(400).json({ mensaje: 'Se requiere la clave del archivo para la descarga.' });
    }
  
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: "curriculum/"+key,
    };
  
    const command = new GetObjectCommand(params);
  
    try {
      const response = await S3_CLIENT.send(command);
  
      if (!response.Body) {
        return res.status(404).json({ mensaje: 'El archivo no se encontró en S3.' });
      }
  
      // Establece los encabezados de respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${key}"`);
  
      // Envía el cuerpo del archivo como un stream
      response.Body.pipe(res);
  
    } catch (error) {
      console.error('Error al descargar el archivo desde S3:', error);
      if (error.$metadata && error.$metadata.httpStatusCode === 404) {
        return res.status(404).json({ mensaje: 'El archivo no se encontró en S3.', encontrado: false });
      }
      res.status(500).json({ mensaje: 'Error al descargar el archivo desde S3.' });
    }
  });

module.exports = router;

