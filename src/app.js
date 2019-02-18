const express = require('express');
const morgan = require('morgan');
const app = express();
const usersRoutes = require('./routers/user');
const travelerRoutes = require('./routers/travelers');
const isAuth = require('./middlewares/auth');
const travelRoutes = require('./routers/trip');


//CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
  next();
});


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

/*Ejemplo de como utilizar rutas privas solo accedidas por usuarios registrados
con tokens*/
app.get('/private',isAuth,(req,res)=>{
  res.status(200).send({message: "Tienes Acceso"})
});//




//Staring Server
app.listen(app.get('port'), () =>{
  console.log('Server on port ',app.get('port'));
});
