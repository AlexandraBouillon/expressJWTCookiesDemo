const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const { send } = require('process');

const app = express();

const secret = 'SHHHHHHHHH';
const cookieSecret = "BeVewyQuiet";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(cookieSecret));
app.use(express.static(path.join(__dirname,'public')));

 /*  */
/*
This is the middleware that checks the JWT token in the cookie to see if it's valid
if it is, we call next(), otherwise we send a 401 Unauthorized
*/

const authRequired = (req, res, next) => {
    /*We Grab the token from the cookies */
    const token = req.signedCookies.token;
    /* JWT verify throws an exception when the token isn't valid */
    try{}catch(error){
        res.status(401).send({
            loggedIn:false,
            message:"Unarthorized"
        });
        return;
    }
    next();
}


const users = {
    testuser:"password"
}
 /*
 Logs a user in
 using the hardcoded users in this demo
 otherwise we would check the DB
 */

 app.post("/login",(req,res,next) => {
     const {username, password} = req.body;
     //console.log(req.body);

     if (users[username] && users[username] === password) {
          /*
          We Sign a JWT and store it in a cooke on the response.
          The browser will store it and send it back down
          */

          res.cookie('token', jwt.sign({
              username
          }, secret),{
              sameSite:'strict',
              httpOnly:true,
              signed:true
          })
          res.send({
              loggedIn:true,
              message: "Successfully Logged In"
          });
     } else {
         res.status(401).send({
             loggedIn:false,
             message:"Unauthorized"
         });
     }
 });

 /* This logs the user out by clearing the token cookie */

 app.get('/logout',( req, res, next) => {
     /* We clear the token cookie to log the user out */
     res.clearCookie('token',{
         sameSite:'strict',
         httpOnly: true,
         signed: true
     })
     res.send({
         loggedIn:false,
         message:'Logged Out'
     });
 });

 module.exports = app;
