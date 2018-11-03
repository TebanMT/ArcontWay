const mysqlConnection = require('../connection_db');

/*Funcion que verifica si el usuario ya existe en la bd
antes de ser registrado*/
function verifyUser(email){
    const verify = new Promise((resolve, reject) =>{
        try{
            mysqlConnection.query("SELECT email FROM usuario WHERE email=?",[email],(rows,error)=>{
                if(!error){
                    
                    console.log(rows);
                    if(rows!=0){
                        resolve({
                            success: true
                        });
                    }
                }
                console.log(error);
            });
            
        }catch(err){
            reject({
                status: 500,
                message: "Token Incorrecto"
            })
        }
    })
    return verify;
}

module.exports = {verifyUser}