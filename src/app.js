const express = require('express');
const morgan = require('morgan');
const app = express();
const usersRoutes = require('./routers/user');
const travelerRoutes = require('./routers/travelers');
const isAuth = require('./middlewares/auth');
const travelRoutes = require('./routers/trip');
const authenticationRoutes = require('./routers/authentication');


//Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/users', usersRoutes);
app.use('/travelers', travelerRoutes);
app.use('/trip', travelRoutes);
app.use('/authentication', authenticationRoutes);

/*Ejemplo de como utilizar rutas privas solo accedidas por usuarios registrados
con tokens*/
app.get('/private',isAuth,(req,res)=>{
  res.status(200).send({message: "Tienes Acceso"})
});//




//Staring Server
app.listen(app.get('port'), () =>{
  console.log('Server on port ',app.get('port'));
});
