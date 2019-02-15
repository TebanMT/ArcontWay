const mysqlConnection = require('../connection_db');
const tokenService = require('../services/token');
const userService = require('../services/users');

module.exports = {

  showUser: async (req, res, next) => {
    await mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        console.log(err);
      }
    });
  },

  signUpByNumberPhone: (req, res) => {
    if(!req.headers.authorization){
      return res.status(401).send({message : "No tienes Autorización"});
    }
    const token = req.headers.authorization.split(' ')[1];    
    const user = req.body;
    id = userService.generateId(user.name, user.lastname, user.login_with);
    tokenService.getDataTokenExternal(token)
     .then(data =>{
        mysqlConnection.query('INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [id,user.name,user.lastname,user.second_lastname,user.lada,data.numero,user.email,"",user.card,user.type_card,user.points], (err, rows, fields) => {
          if(!err){
            res.status(200).send({
               "success" : true,
                "message" : "Registro Exitoso"
            });  
          }
          else{
            console.log(err);
            res.status(500).send({
              "success" : false,
              "messag" : "Ups, Error interno del servidor"
            });
          }
        });
      })
     .catch(error => {
        res.send(error);
     })
  }

};
