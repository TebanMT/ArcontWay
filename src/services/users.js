const mysqlConnection = require('../connection_db');

/*Funcion que verifica si el usuario ya existe en la bd
antes de ser registrado*/
function verifyTraveler(data){
    const verify = new Promise((resolve, reject) =>{
        try{
            mysqlConnection.query("SELECT id_usuario,telefono FROM usuario WHERE telefono=?",[data.numero],(err,rows)=>{
                if(!err){
                    if(rows.length == 0){
                         resolve({status:200,success: false,message: "Usuario no se encuentra registrado"});
                    }else{
                        resolve({status:200,success: true,message: "El Usuario ya se encuentra registrado", id: rows[0]["id_usuario"]});     
                    }
                }
            });
        }catch(err){
            reject({status: 500,message: "Error del servidor"})
        }
    })
    return verify;
}

function registerUser(data,user) {
    const register = new Promise((resolve, reject) =>{
        try{
            mysqlConnection.query('INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?)',
            [user.id_user,user.name,user.lastname,user.second_lastname,data.prefijo_pais,data.numero,user.email,user.password,user.tipo_registro], (err, rows, fields) => {
                if(!err){
                    resolve({status: 200,message: "Registro Exitoso", id: user.id_user});
                }
                else{
                    resolve({status: 500,message: "Error al registrar usuario"}); 
                }
            });
        }catch(err){
            reject({status: 500,message: "Error del servidor"})
        }
    })
    return register;
}

module.exports = {verifyTraveler,registerUser}