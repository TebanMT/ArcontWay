const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
var crypto    = require('crypto');
const Request  = require('request');

/* FUNCIONES PARA LOS TOKEN DE USUARIOS QUE INICIARON SESION CON 
   LOS METODOS EXTERNOS (FB, NUM CEL, CORREO)*/

//Funcion para obtener el App Secret Proof por medio del token de usuario
function generateAppSecretProof(token){
    var hmac;
    hmac = crypto.createHmac('sha256', config.APP_SECRET);
    hmac.update(token);
    hash = hmac.digest('hex');
    return hash;
}

//Funcion para obtener los datos del usuiario registrado por metodos externos (FB ó CORREO)
function getDataTokenExternal(token){

    const decode = new Promise((resolve, reject) =>{
        try {
            const app_secret_proof = generateAppSecretProof(token);
            const me_endpoint_url = config.ENDPOINT_URL + '?access_token=' + token + '&appsecret_proof=' + app_secret_proof; 
            Request.get({ url: me_endpoint_url, json: true }, function (err, resp, respBody) {        
                if (respBody.phone) {
                    resolve({full_number: respBody.phone.number ,prefijo_pais: respBody.phone.country_prefix, numero: respBody.phone.national_number});
                }
                else{
                    resolve({
                        status: 404,
                        message: "Error de Token"
                    })
                }
            });
           
        } catch (error) {
            reject({
                status: 500,
                message: "url no diponible"
            })
        }
    });
    return decode;
}


/*--- FUNCIONES PARA LOS TOKEN DE LOS USURIOS REGISTRADOS EN EL SISTEMA QUE ¡¡NO!! 
      INICIARON SESION CON LOS METODOS EXTERNOS (FB, NUM CEL, CORREO)*/

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


module.exports = {createToken, decodeToken, generateAppSecretProof, getDataTokenExternal}