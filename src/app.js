const express = require('express');
const morgan = require('morgan');
const app = express();
const usersRoutes = require('./routers/user');
const travelerRoutes = require('./routers/travelers');


//Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/users', usersRoutes);
app.use('/travelers', travelerRoutes);


//Staring Server
app.listen(app.get('port'), () =>{
  console.log('Server on port ',app.get('port'));
});
