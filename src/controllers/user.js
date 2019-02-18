const mysqlConnection = require('../connection_db');
const service = require('../services/users');
const tokenService =  require('../services/token');
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

  isSignUpTraveler: (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    tokenService.getDataTokenExternal(token)
     .then(data =>{
      service.verifyTraveler(data)
      .then(responde => {
        res.send(responde); 
      })
      .catch(error =>{
          res.status(error);
      })
     })
     .catch(error => {
        res.send(error);
     }) 
  }

};
