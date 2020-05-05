const express = require('express');
const chalk = require('chalk');
const app = express();
const PORT = process.env.PORT || 5000
const database = require('./conf');
const bcrypt = require('bcrypt');

//Activamos el motor de vistas y lo configuramos para que utilice hbs
app.set('view engine', 'hbs');

//Activamos el body parser de express
app.use(express.urlencoded({extended: false}));

//Ruta GET para renderizar la vista home
app.get('/', (req, res)=>{
  res.render('home');
})

//Ruta GET para renderizar la vista login
app.get('/login', (req, res)=>{
  res.render('login')
})

//Ruta GET para renderizar la vista register
app.get('/register', (req, res)=>{
  res.render('register')
})

//Ruta POST para registrar un nuevo usuario
app.post('/register', async (req, res)=>{

  //Array de errores donde vamos a meter todos los errores 
  let errors = [];

  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  //Comprobar si hay algún campo vacío
  if(!name || !password || !confirmPassword || !email){
    errors.push({msg: 'Tienes que rellenar todos los campos', subMsg: 'Acuerdate que las dos contraseñas tienen que ser iguales'})
  }

  //Comprobar si la contraseña es demasiado corta
  if(password.length < 6){
    errors.push({msg: 'Tu contraseña es demasiado corta', subMsg: 'Acuerdate que las dos contraseñas tienen que ser iguales'})
  }

  //Comprobar si las dos contraseñas introducidas son iguales
  if(password !== confirmPassword){
    errors.push({msg: 'Las dos contraseñas no coinciden', subMsg: 'Acuerdate que las dos contraseñas tienen que ser iguales'})
  }

  //Comprobar que el email tenga una @
  if(!email.includes('@')){
    errors.push({msg: 'Email incorrecto', subMsg: 'Acuerdate que las dos contraseñas tienen que ser iguales'})
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email
    })
  } else {
    const hashedPassword =  await bcrypt.hash(password, 5)
    const validatedBody = {
      name: name,
      password: hashedPassword,
      email: email
    }
    database.query('INSERT INTO user SET ?', validatedBody, (error, results)=>{
      !error
      ? res.send('Usuario creado con exito')
      : res.send(error)
    })
  }
})

//Ruta GET para renderizar la vista not-found
app.get('*', (req, res)=>{
  res.render('not-found')
})

app.listen(PORT, ()=>{
  console.log(chalk.green.inverse.bold(`Conectado servidor en puerto ${PORT}`))
})