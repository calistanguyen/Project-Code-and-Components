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
  host: 'localhost', 
  port: 5432, 
  database: 'tender',
  user: 'postgres'
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
            next()
          }
          if(data != undefined){
            req.userId = data.userId
            next();
          }else{
            req.user = null;
            next();
          }
      });
  } else {
      req.user = null;
      next();
  }
};

app.get('/profile_info', authenticateJWT, (req, res) => {
  if(req.userId != null){
    // make database call using userId
    res.send({authenticated: true, email: req.user});
  } else {
    res.send({authenticated: false, user: null});
  }

});


app.post('/login', (req, res) => {
  console.log("Reaching this?")
  // Read username and password from request body
  const username = req.body.uname;
  const password = req.body.pword; 

  // Filter user from the users array by username and password
  // replace with call to database to someone check if username and password exists, and are correct.
  const user = users.find(u => { return u.username === username && u.password === password }); //query to our database
  
  if (user) {
      // Generate an access token
      const accessToken = jwt.sign({ userId: user.id,  role: user.role }, accessTokenSecret);
      console.log("Returning response")
      res.json({accessToken: accessToken })
  } else {
      res.json({result: 'Username or password incorrect'});
  }
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

  res.render('pages/signup',{

  });
});
app.get('/login', function(req,res){
  var username = req.query.uname; 
  var password = req.query.pword; 
  var getUser = "SELECT * FROM users WHERE username = " +username+" AND password = "+password+";";
  db.any(getUser)
    .then(function(rows){
      res.render('pages/home',{
        user: rows
      })
    })
    .catch(function(err){
      console.log('error', err);
      res.render('pages/home', {
        user: ''
      })
    })

  
});



app.post('/signup/home', function(req,res){
  var username = req.body.username; //holds the input from the form
  var firstname = req.body.firstname; 
  var lastname = req.body.lastname; 
  var password = req.body.password; 
  var setInfo = "INSERT INTO users(firstname, lastname, password, username) VALUES('"+firstname+"','"+lastname+"', '"+password+"', '"+username+"') ON CONFLICT DO NOTHING;" ; //query to insert into table
  var getInfo = "SELECT * FROM users;"
  db.task('get-everything', task =>{ //
    return task.batch([ //returns promise fulfillment or rejectioon
      task.any(setInfo),
      task.any(getInfo)
    ]);
  })
  .then(info => {
    console.log(username); 
    res.render('pages/home',{
      user: info[1]
    })
  })
  .catch(err=>{
    console.log('error', err);
    response.render('pages/home',{
      user: ''
    })
  })
});


app.listen(3000);
console.log('3000 is the magic port');
