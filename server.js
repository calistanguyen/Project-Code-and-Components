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

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


//home page
app.get('/home', function(req, res) {
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
;})

app.post('/signup', function(req,res){
  var username = req.body.username; //holds the input from the form
  var firstname = req.body.firstname; 
  var lastname = req.body.lastname; 
  var password = req.body.password; 
  var getInfo = "INSERT INTO users(firstname, lastname, password, username) VALUES('"+firstname+"','"+lastname+"', '"+password+"', '"+username+"') ON CONFLICT DO NOTHING;" ; //query to insert into table
  db.task('get-everything', task =>{
    return task.batch([
      task.any(getInfo)
    ]);
  })
  .then(info => {
    console.log(username); 
    res.render('pages/signup',{
      user: username, 
      fname: firstname,
      lname: lastname, 
      passw: password
    })
  })
  .catch(err=>{
    console.log('error', err);
    response.render('pages/signup',{
      user: '',
      fname: '',
      lname: '', 
      passw: ''
    })
  })
});

app.listen(3000);
console.log('3000 is the magic port');
