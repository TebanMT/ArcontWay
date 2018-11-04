const mysqlConnection = require('../connection_db');

module.exports = {

//Funcion que registra un nuevo viaje
  newTrip:  (req, res, next) => {
    const travel = req.body;
    mysqlConnection.query('select id_usuario from usuario where id_usuario=4', (err,rows,fields) => {
     mysqlConnection.query('INSERT INTO viaje VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
     [travel.id_viaje,travel.origen,travel.destino,travel.costo,travel.hora_salida,travel.hora_llegada,travel.fecha,travel.lugares_disponibles,travel.descripcion,travel.contacto,travel.id_auto,rows[0].id_usuario], (err, rows, fields) => {
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
  },

  //Funcion que muestra los viajes que han sido registrados
  showTrip: async (req, res, next) => {
    await mysqlConnection.query('SELECT * FROM viaje LIMIT 10', (err, rows, fields) => {
      if(!err){
        res.json(rows);
      }
      else {
        console.log(err);
      }
    });
  }

};
