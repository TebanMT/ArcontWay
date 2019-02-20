const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'esteban',
  password: 'Mendiola2015*',
  database: 'arcontway'
});

mysqlConnection.connect(function (err) {
  if(err){
    console.log(err);
    return;
  } else {
    console.log('DB is connected');
  }
});

module.exports = mysqlConnection;
