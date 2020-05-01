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
//var https = require('https');
const request = require('request');
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
if(process.env.DATABASE_URL!=undefined)
{
  var db= pgp(process.env.DATABASE_URL);
}else {
  var db = pgp(dbConfig);
}



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
            req.id = data.id;
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
  if(req.authenticated==true){
    res.send({authenticated: true, username: req.user, name: req.name, userid: req.id});
  } else {
    res.send({authenticated: false, username: null, name: null});
  }

});

app.get('/profile_recipes', authenticateJWT, (req,res) => {
  if(req.authenticated==true)
  {
    var user = req.id;
    console.log(user);
    var recipes = "SELECT * FROM saved_recipes WHERE user_id = " + user + ";";
    console.log(recipes);
    db.any(recipes)
    .then(function(rows){
      var url_params='';
      var url = "https://api.spoonacular.com/recipes/informationBulk?ids=";
      rows.forEach(row=>{
        url_params+= row.recipe_id + ','
      })
      url_params= url_params.slice(0, url_params.length-1);
      url_params+= '&apiKey=ac9d1996174844fa8bd9d2ba7b497976'
      url+=url_params;
      console.log(url);
      request(url, {json:true}, (err,response,recipes)=>{//calls out to API for informatiomn
        res.send({recipe_arr: recipes, authenticated:true});
      })
    })
    .catch(function(err){
      console.log(err);
    })
  }else{
    res.send({authenticated:false});
  }
  //database query

})


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
        const accessToken = jwt.sign({ userId: rows[0].username,  password: rows[0].password, firstname: rows[0].firstname, id: rows[0].user_id}, accessTokenSecret);
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

app.post('/add',authenticateJWT, function(req, res){
  //take id from the page and info from the token and put it into the table
  console.log(req.body.id);
  console.log(req.id);
  var userId = req.id;
  var recipeId = req.body.id;
  var addRecipe = "INSERT INTO saved_recipes(user_id, recipe_id) VALUES(" + userId + ", '"+recipeId + "');";
  db.any(addRecipe)
  .then(function(rows){
    console.log(rows);
    res.json({success:true});
    //res.render('pages/home');
  })
  .catch(function(err){
    res.json({success:false});
    console.log(err);
  })

});


//home page
app.get('/home', authenticateJWT, function(req, res) {
  console.log('User:' + req.user)
  res.render('pages/home');
});

//profile page
app.get('/profile', function(req, res){
  res.render('pages/profile');
});

//recipe page
app.get('/recipe', function(req,res){
	//console.log(req);
	var id= req.query.id;//parses the ID from the query
	console.log(id);
	var url= 'https://api.spoonacular.com/recipes/'+id+'/information?apiKey=ac9d1996174844fa8bd9d2ba7b497976';//gets info from API
	request(url, {json:true}, (err,response,body)=>{//calls out to API for information
		var ingredients=body.extendedIngredients;
		//console.log(ingredients);
		res.render('pages/recipe',{ //gives information to the recipes page
			recipe_name: body.title,
			cook_time: body.readyInMinutes,
			summary: body.summary,
			servings: body.servings,
			image_url: body.image,
			ingredients: ingredients,
			recipe_url: body.sourceUrl
	  });
	})

});
//Random testing endpoint

// app.get('/test',function(req,res){
//   //call the API here, save the data
//   //res.json({recipe:["broccoli","sandwich"]})
// 	//var id = 0;
// 	var apiKey='ac9d1996174844fa8bd9d2ba7b497976';
// 	var url="https://api.spoonacular.com/recipes/search?apiKey="+apiKey+"&number=1&query=sandwich";
//
// 	request( url ,{json:true}, (err,response,body)=>{
// 		if(err){return console.log(err);}
// 		var id= JSON.parse(body.results[0].id);
// 		var new_url='https://api.spoonacular.com/recipes/'+id+'/information?apiKey=ac9d1996174844fa8bd9d2ba7b497976';
// 		request(new_url, {json:true}, (err2,response2,body2)=> {
// 			res.render('pages/recipe',{
// 				recipe_name: body2.title,
// 			})
// 		})
// 	});
//
// })
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
