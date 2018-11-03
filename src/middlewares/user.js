const service = require('../services/users');

/*Funcion que verifica si un usuario tiene autorizacion para 
utilizar recusros privados del sistema*/
function isSignUp(req,res,next){
    const user = req.body;
    service.verifyUser(user.email)
        .then(responde => {
            req.user = responde;
            next();
        })
        .catch(responde =>{
            res.status(responde.status);
        })

   
}
module.exports = isSignUp