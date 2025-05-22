const pgp = require('pg-promise')();
//const db = pgp('postgres://postgres:admin@localhost:5432/base_de_datos_prueba_sarai');
const db = pgp('postgresql://postgres:ipakJovbsDwyLTWpFzyeoQqUsOTnGZsM@shortline.proxy.rlwy.net:20186/railway');
module.exports =  db;