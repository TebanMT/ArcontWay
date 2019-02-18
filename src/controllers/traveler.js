const mysqlConnection = require('../connection_db');
const service = require('../services/token');
const bcrypt = require('bcrypt');
//const BCRYPT_SALT_ROUNDS = 12;
const tokenService = require('../services/token');
const uuidv4 = require('uuid/v4');
const userService = require('../services/users');

// Funcones a exportar
module.exports = {

  //Funcion que muestra todos los Viajeros registrados
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

  //Funcion que registra un nuevo usuario que a la vez sera un viajero
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
              res.status(500);
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

  //Funcion que proporciona acceso a un viajero previamente registrado --Login--
  getData: (req,res)=>{
    const {id}= req.params;
    console.log(id);
    mysqlConnection.query('SELECT u.*, v.* FROM usuario as u INNER JOIN viajero as v ON v.id_usuario=u.id_usuario WHERE u.id_usuario=?',[id], (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        console.log(err);
      }
    });
    
  }//

}
