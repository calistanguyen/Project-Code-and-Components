console.log("Loaded functions.js");
var apiKey= "ac9d1996174844fa8bd9d2ba7b497976";
var currentID=0;

function setCurrID(id)
{
  currentID=id;
}

function goToRecipe()
{
  //reroutes the pages to the recipe page with the given recipe's ID
  window.location.href="/recipe?id="+currentID;
}

function randomizeRecipe()
{
  var url= "https://api.spoonacular.com/recipes/random?apiKey="+apiKey;//randomizes a recipe to view in the card
  $.ajax({url:url, dataType:"json"}).then(function(data){//calls out to the API with ajax
    //sets the currentID variable to the recipe that is being shown
    setCurrID(data.recipes[0].id);

    //updates all the information to show for the user
    document.getElementById('recipeName').innerHTML= data.recipes[0].title;
    document.getElementById('prepTime').innerHTML="Ready in " + data.recipes[0].readyInMinutes + " minutes";
    document.getElementById('recipePic').src=data.recipes[0].image;
    document.getElementById('desc').innerHTML= data.recipes[0].summary;
    document.getElementById('goto-recipe').setAttribute("data-currID", currentID);
  })
}
