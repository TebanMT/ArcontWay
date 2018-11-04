const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

//Funcio que resive la informacion del usuario y crea un token
function createToken(user){
    
    const payload = {
        "sub" : user.id_usuario,
        "iat" : moment().unix(),
        "exp" : moment().add(14, "days").unix()
    };
    return jwt.encode(payload, config.SECRET_TOKEN);
}//

/*Funcion que recibe un token, ejecuta una promesa para decodificar el token y
 verificar si el token es valido o ha expirado*/
function decodeToken(token){
    const decode = new Promise((resolve, reject) =>{
        try{
            const payload = jwt.decode(token, config.SECRET_TOKEN)
            if(payload.exp < moment().unix()){
                reject({
                    status: 401,
                    message: "El token ha expirado"
                })
            }
            //console.log(payload);
            resolve(payload.sub)
        }catch(err){
            reject({
                status: 500,
                message: "Token Incorrecto"
            })
        }
    })
    return decode;
}


module.exports = {createToken,decodeToken}