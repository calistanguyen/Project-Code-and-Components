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
//var https = require('https');
const request = require('request');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();


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
	//console.log(req);
	var id= req.query.id;
	console.log(id);
	var url= 'https://api.spoonacular.com/recipes/'+id+'/information?apiKey=ac9d1996174844fa8bd9d2ba7b497976';
	request(url, {json:true}, (err,response,body)=>{
		var ingredients=body.extendedIngredients;
		console.log(ingredients);
		res.render('pages/recipe',{
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

app.get('/test',function(req,res){
  //call the API here, save the data
  //res.json({recipe:["broccoli","sandwich"]})
	//var id = 0;
	var apiKey='ac9d1996174844fa8bd9d2ba7b497976';
	var url="https://api.spoonacular.com/recipes/search?apiKey="+apiKey+"&number=1&query=sandwich";

	request( url ,{json:true}, (err,response,body)=>{
		if(err){return console.log(err);}
		var id= JSON.parse(body.results[0].id);
		var new_url='https://api.spoonacular.com/recipes/'+id+'/information?apiKey=ac9d1996174844fa8bd9d2ba7b497976';
		request(new_url, {json:true}, (err2,response2,body2)=> {
			res.render('pages/recipe',{
				recipe_name: body2.title,
			})
		})
	});

})
//sign up page
app.get('/signup', function(req,res){
  res.render('pages/signup',{

  });
;})

app.listen(3000);
console.log('3000 is the magic port');
