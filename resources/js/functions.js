console.log("Loaded functions.js");
var apiKey= "ac9d1996174844fa8bd9d2ba7b497976";
var currentID=0;

function setCurrID(id)
{
  currentID=id;
}

function goToRecipe()
{
  window.location.href="/recipe?id="+currentID;
}

function randomizeRecipe()
{
  var url= "https://api.spoonacular.com/recipes/random?apiKey="+apiKey;
  //var url='https://api.spoonacular.com/recipes/595476/information?apiKey=ac9d1996174844fa8bd9d2ba7b497976';
  $.ajax({url:url, dataType:"json"}).then(function(data){
    //console.log(data);
    setCurrID(data.recipes[0].id);
    document.getElementById('recipeName').innerHTML= data.recipes[0].title;
    document.getElementById('prepTime').innerHTML="Ready in " + data.recipes[0].readyInMinutes + " minutes";
    document.getElementById('recipePic').src=data.recipes[0].image;
    document.getElementById('desc').innerHTML= data.recipes[0].summary;
    document.getElementById('goto-recipe').setAttribute("data-currID", currentID);
  })
}
