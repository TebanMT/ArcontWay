const mysqlConnection = require('../connection_db');

module.exports = {

  showTraveler: async (req, res, next) => {
    await mysqlConnection.query('SELECT * FROM viajero', (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        console.log(err);
      }
    });
  },

  newTraveler:  (req, res, next) => {
    const user = req.body;
     mysqlConnection.query('INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [user.id_usuario,user.nombre,user.apellido_p,user.apellido_m,user.lada_nacional,user.telefono,user.email,user.password,user.tarjeta,user.tipo_tarjeta,user.puntos], (err, rows, fields) => {
      if(!err){
         mysqlConnection.query('select MAX(id_usuario) as id_usuario from usuario', (err,rows,fields) => {
           mysqlConnection.query('INSERT INTO viajero VALUES(?,?,?)',[user.viajero,user.total_viajes,rows[0].id_usuario],(err,rows,fields) => {
            if (!err) {
              res.status(200).json({
                "success" : true,
                "msg" : "Registro Exitoso"
              });
              
            }
            else{
              res.json({
                "success" : false,
                "msg" : "Ups, Servidor no disponible"
              });
              
            }
          });
        });
      }
      else {
        res.json({
          "success" : false,
          "msg" : "Ups, Servidor no disponible"
        });
      }
    });
  }

}
