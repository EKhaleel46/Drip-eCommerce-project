const express = require('express');
const path = require('path');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const logger = require('morgan');
const session = require('express-session')
const nocache = require('nocache');
const cors = require('cors');
const flash = require('express-flash');

// importing env
require('dotenv').config();

// Database connecting
const db = require('./config/dbConnect');
 
db()
.then(()=>{
    console.log('Database Connected successfully')
})
.catch((error)=>{
    console.log('Database connection failed', error);
})

// setting App
const app = express();

//view engine setup
app.use("/",express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(nocache())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSIONSECRET, // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  }));
app.use(flash())


// setting Routes
app.use('/', userRoute);
app.use('/admin', adminRoute);

// error handing middleware
app.use((err, res, next) => {
    res.status(404).render('users/error-404');
});

// setting port
const PORT = process.env.PORT

app.listen(PORT, console.log(`server is running on  http://localhost:${PORT}`))