const mysqlConnection = require('../connection_db');
const service = require('../services/token');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

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
    const user = req.body;
    user.id_usuario=uuidv4();
    bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS) //promesa para encriptar la contraseña
    .then(hashedPassword => { // success
      mysqlConnection.query('INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [user.id_usuario,user.nombre,user.apellido_p,user.apellido_m,user.lada_nacional,user.telefono,user.email,hashedPassword,user.tarjeta,user.tipo_tarjeta,user.puntos], (err, rows, fields) => {
        if(!err){
            mysqlConnection.query('INSERT INTO viajero VALUES(?,?,?)',[user.viajero,user.total_viajes,user.id_usuario],(err,rows,fields) => {
              if (!err) {
                res.status(200).send({
                  "success" : true,
                  "message" : "Registro E xitoso",
                  "token" : service.createToken(user)//creamos el token con el que se identificara al nuevo viajero(usuario)
                }); 
              }
              else{
                res.status(500).send({
                  "success" : false,
                  "message" : "Ups, Servidor no disponible"
                });  
              }
          });
        }
        else{
          res.status(500).send({
            "success" : false,
            "message" : "Ups, Servidor no disponible"
          });
        }
      });
    })
    .catch(error =>{ //Error
      res.status(500).send({
        "success" : false,
        "message" : "Ups, Hash no disponible",error
      });
    });

  },//

  //Funcion que proporciona acceso a un viajero previamente registrado --Login--
  signIn: (req,res)=>{
    const user = req.body;
    mysqlConnection.query("SELECT u.*,t.* FROM usuario as u INNER JOIN viajero as t ON u.id_usuario=t.id_usuario WHERE u.email=? AND u.password=?",
    [user.email,user.password],(err, rows)=>{
        if(!err){
            if(rows != 0){
                res.status(200).send({success: true,message: "Te has logueado correctamente", token: service.createToken(user)})
            }else res.status(404).send({message: "El usuario no existe"})           
        }else res.status(500).send({message: err})
    });
    
  }//

}
