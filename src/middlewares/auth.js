const service = require('../services/token');

/*Funcion que verifica si un usuario tiene autorizacion para 
utilizar recusros privados del sistema*/
function isAuth(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message : "No tienes Autorización"});
    }
    const token = req.headers.authorization.split(' ')[1];
    service.decodeToken(token)
        .then(responde => {
            req.user = responde;
            next();
        })
        .catch(responde =>{
            res.status(responde.status);
        })

   
}
module.exports = isAuth