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
    user.id_user=uuidv4();
    bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS) //promesa para encriptar la contraseña
    .then(hashedPassword => { // success
      mysqlConnection.query('INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [user.id_user,user.name,user.lastname,user.second_lastname,user.lada,user.number_phone,user.email,hashedPassword,user.card,user.type_card,user.points], (err, rows, fields) => {
        if(!err){
            mysqlConnection.query('INSERT INTO viajero VALUES(?,?,?)',[user.viajero,user.total_trips,user.id_user],(err,rows,fields) => {
              if (!err) {
                res.status(200).send({
                  "success" : true,
                  "message" : "Registro Exitoso",
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
    mysqlConnection.query("SELECT u.*,t.* FROM usuario as u INNER JOIN viajero as t ON u.id_usuario=t.id_usuario WHERE u.email=? ",
    [user.email],(err, rows)=>{
        if(!err){
            if(rows != 0){
              bcrypt.compare(user.password,rows[0]['password'])
              .then(password =>{
                if(password)
                  return res.status(200).send({success: true,message: "Te has logueado correctamente", token: service.createToken(user)});
                res.status(403).send({success: false, message: "Contraseña Incorrecta"});
              })
              .catch(err =>{
                res.status(500).send({success: false, message: err});
              })
            }else res.status(403).send({message: "Email no se encuatra registrado"})           
        }else res.status(500).send({success: false,message: err})
    });
    
  }//

}
