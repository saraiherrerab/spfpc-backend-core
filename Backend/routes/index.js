var express = require('express');
const db = require('../database');
var router = express.Router();

async function obtenerValor() {
  try {
    const result = await db.any('SELECT * FROM prueba');
    console.log('Resultado:', result); // { value: 123 }
    return result;
  } catch (error) {
    console.error('Error al hacer la consulta:', error);
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  const query = obtenerValor();
  res.json(query)
  
});


module.exports = router;
