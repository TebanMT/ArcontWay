const service = require('../services/users');

/*Funcion que verifica si un usuario ya ha sido previamente
registrado con email y telefono*/
function isSignUp(req,res,next){
    const user = req.body;
    service.verifyUser(user.email,user.telefono)
        .then(responde => {
            if(responde.status == false){return res.status(200).send({message: responde.message});}
            next();
        })
        .catch(responde =>{
            res.status({status: responde.status, message: responde.message});
        })

   
}
module.exports = isSignUp