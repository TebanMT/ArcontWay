const mysqlConnection = require('../connection_db');

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
  }

};
