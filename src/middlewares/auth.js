const service = require('../services/token');
const config = require('../config');
const Request  = require('request');

/*Funcion que verifica si un usuario tiene autorizacion para 
utilizar recusros privados del sistema*/
function isAuth(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message : "No tienes Autorización"});
    }
    const token = req.headers.authorization.split(' ')[1];
    const app_secret_proof = service.generateAppSecretProof(token);
    var me_endpoint_url = config.ENDPOINT_URL + '?access_token=' + token + '&appsecret_proof=' + app_secret_proof;
    Request.get({ url: me_endpoint_url, json: true }, function (err, resp, respBody) {        
        if (respBody.phone) {
            next();
        } else if (respBody.email) {
            console.log(respBody);
        }else{
            service.decodeToken(token)
                .then(responde => {
                    req.user = responde;
                    next();
                })
                .catch(responde =>{
                    res.status(responde.status);
                })
        }
        //res.status(200).send(respBody);
    });
    
    
    
    
    /*service.decodeToken(token)
        .then(responde => {
            req.user = responde;
            next();
        })
        .catch(responde =>{
            res.status(responde.status);
        })*/

   
}
module.exports = isAuth