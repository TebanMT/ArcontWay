const mysqlConnection = require('../connection_db');
const service = require('../services/token');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token');
const uuidv4 = require('uuid/v4');
const userService = require('../services/users');
//const BCRYPT_SALT_ROUNDS = 12; constante para hasheara la contraseña :DEPRECIADA

// Funcones a exportar
module.exports = { show,

/**
  * @method
  * @desc Obtiene todos los Viajeros registrados ::DEPRECIATED 
  * @since 0.0.1
  * @version 0.1.0
  * @returns {JSON} Usuarios registrados como viajeros 
  * @throws {ER_NO_SUCH_TABLE} Tabla no existente en la BD
  * @throws {ER_PARSE_ERROR} Error de sintaxis en la consulta SQL
  * @throws {Error} Error general
*/
  showTraveler: (req, res, next) => {
    mysqlConnection.query('SELECT * FROM viajero', (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        console.log(err);
      }
    });
  },//


/**
  * @method
  * @desc Registra un nuevo usuario y ese uauario lo registra como viajero
  * @since 0.0.1
  * @version 1.0.0
  * @param {integer} [customerId] ID de Cliente
  * @param {integer} serviceId ID de Servicio
  * @param {integer} staffId ID de Staff
  * @todo Agregar Latitude/Longitude para ordenar las ubicaciones por distancia
  * @returns {Array} Locations
  * @throws {LocationNotValidError} Se han encontrado ubicaciones pero ninguno es valido para el servicio o staff elegido
  * @throws {LocationNotFoundError} Cantidad de ubicaciones encontrados es cero
  * @throws {Error} Error general
*/
  singUp:  (req, res, next) => {
    if(!req.headers.authorization){
      return res.status(401).send({message : "No tienes Autorización"});
    }
    const token = req.headers.authorization.split(' ')[1];    
    const user = req.body;
    user.id_user=uuidv4();
    tokenService.getDataTokenExternal(token)
     .then(data =>{
        userService.registerUser(data,user)
        .then(success => {
          mysqlConnection.query('INSERT INTO viajero VALUES(?,?,?,?)',[null,0,user.total_trips,user.id_user],(err,rows,fields) => {
            if (!err) {
                res.send(success);
            }
            else{
              res.send(success);
            }
          });
        })
        .catch(error =>{
          res.send(error);
        })
      })
     .catch(error => {
        res.send(error);
     })
  },//

  //Funcion que obtiene los datos de un usuario especifico por medio de su id
  getData: (req,res)=>{
    const {id}= req.params;
    mysqlConnection.query('SELECT u.*, v.* FROM usuario as u INNER JOIN viajero as v ON v.id_usuario=u.id_usuario WHERE u.id_usuario=?',[id], (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        res.json(err);
      }
    });
    
  }//

}
