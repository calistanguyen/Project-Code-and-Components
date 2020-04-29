//notes about making server
// req -- the request coming in from the client
// res -- the result being sent to the client
//fs.readFile() allows node to read a file

/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
require('dotenv').config();
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const jwt = require('jsonwebtoken');
//Create Database Connection
var pgp = require('pg-promise')();

//connecting tender data base
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
};
var db = pgp(dbConfig);

const users = [
  {
      username: 'john',
      password: 'pw',
      role: 'admin'
  }, {
      username: 'anna',
      password: 'pw',
      role: 'member'
  }
];


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


const accessTokenSecret = 'tenderproject';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, data) => {
          if (err) {
            req.user = null;
            req.authenticated=false;
            next()
          }
          if(data != undefined){
            //req.userId = data.userId;
            req.user = data.userId;
            req.name = data.firstname;
            req.authenticated=true;
            next();
          }else{
            req.user = null;
            req.authenticated=false;
            next();
          }
      });
  } else {
      req.user = null;
      req.authenticated=false;
      next();
  }
};

app.get('/profile_info', authenticateJWT, (req, res) => {
  //query for all recipes that a user has saved
  if(req.authenticated==true){
    // make database call using userId
    res.send({authenticated: true, username: req.user, name: req.name});
  } else {
    res.send({authenticated: false, username: null, name: null});
  }

});


app.post('/login', (req, res) => {
  console.log("Reaching this?")
  //Read username and password from request body
  const username = req.body.uname;
  const password = req.body.pword;

  // Filter user from the users array by username and password
  // replace with call to database to someone check if username and password exists, and are correct.
  //const user = users.find(u => { return u.username === username && u.password === password }); //query to our database

  var user = "SELECT * FROM users WHERE username = '" + username + "' and password = '" + password + "';"; //query

  db.any(user)
  .then(function(rows){
    console.log(rows);
      // Generate an access token
      console.log(rows.length);
      if(rows.length>0)//if there is data in the query
      {
        const accessToken = jwt.sign({ userId: rows[0].username,  password: rows[0].password, firstname: rows[0].firstname}, accessTokenSecret);
        console.log("Returning response")
        res.json({accessToken: accessToken, success: true})
      }
      else //if there is no data in the query
      {
        res.json({success: false});
      }
  })
  .catch(function(err){
    console.log(err);
  })

  // if (user) {
  //     // Generate an access token
  //     const accessToken = jwt.sign({ userId: username,  role: user.role }, accessTokenSecret);
  //     console.log("Returning response")
  //     res.json({accessToken: accessToken })
  // } else {
  //     res.json({result: 'Username or password incorrect'});
  // }

});


//home page
app.get('/home', authenticateJWT, function(req, res) {
  console.log(req.user)
  res.render('pages/home',{

  });
});

//profile page
app.get('/profile', function(req, res){
  res.render('pages/profile',{

  });
});

//recipe page
app.get('/recipe', function(req,res){

  res.render('pages/recipe',{

  });
});

app.get('/test',function(req,res){
  //call the API here, save the data
  //res.json({recipe:["broccoli","sandwich"]})
})
//sign up page

app.get('/signup', function(req,res){

  res.render('pages/signup');
});



app.post('/signup', function(req,res){
  var username = req.body.username; //receive all the input from the
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var setInfo = "INSERT INTO users(firstname, lastname, password, username) VALUES('"+firstname+"','"+lastname+"', '"+password+"', '"+username+"') ON CONFLICT DO NOTHING;" ; //query to insert into table
  db.any(setInfo)
  .then(function(rows){
    res.render('pages/home');
  })
  .catch(function(err){
    console.log(err);
  })
});

// app.post('/insertPhoto', function(req, res){
//   var pic = req.body.img;
//   var setPic = "INSERT INTO users (img) VALUES('"+pic+"');";
//   db.any(setPic)
//   .then(function(rows){
//     res.render('pages/profile')
//   })
// })


app.listen(3000);
console.log('3000 is the magic port');
