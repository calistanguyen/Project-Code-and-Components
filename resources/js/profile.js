function loadDefaultProfile(){
  // just put generic pictures or emails etc,.
  document.getElementById('name').innerText = "You have not logged in yet!";
  document.getElementById('msg').innerText = "Click the login button in the navbar to login or sign up for an account!";
}

function getProfileInfo(){
  // This will make an ajax call with the token stored in local storage.
  // If there is a valid token the response should print out the username in the
  // browser console. This is all handled in the authenticateJWT middleware function.
    $.ajax({
        url: "https://group6-finalproject-tender.herokuapp.com/profile_info",
        type: 'GET',
        // Fetch the stored token from localStorage and set in the header
        headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    }).done((response) => {

      if (response.authenticated){
        document.getElementById('name').innerText = "Hello, " + response.name + " " + response.lname + "!";
        document.getElementById('msg').innerText = "Click on the 'My Recipes' button below to view your recipes!";

      } else {
		      loadDefaultProfile();
      }

    });
}
function getUserCards()//this takes the recipes from a request from the server and creates cards for each of the saved recipes to be displayed on the profile page
{
  $.ajax({
    url: "https://group6-finalproject-tender.herokuapp.com/profile_recipes",
    type: 'GET',
    // Fetch the stored token from localStorage and set in the header
    headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    }).done((response) => {
      if(localStorage.getItem('token')==null)
      {
        return;
      }
      else if (response.recipe_arr.status=="failure")
      {
        return;
      }
      if(response.authenticated==true)
      {
        var cards= "";
        console.log(response);
        response.recipe_arr.forEach(recipe=>{

          cards += buildCards(recipe.sourceUrl, recipe.image, recipe.title, recipe.summary, recipe.readyInMinutes, recipe.id);
        })
        $('#myrecipes').html(cards);
        //load the recipes into HTML
      }else {
          return;
      }
    });
}
//builds an individual recipe card with the necessary information
function buildCards(recipeUrl, recipeImg, recipeName, recipeDesc, recipeMins, recipeID){
  //build a card
  var card= '';
  card += '<div class = "card"> <div class = "row"> <div class = "col-md-4"> <img src = ';
  card += recipeImg + ' class = "w-100">  </div>  <div class = "col-md-8 px-3"><h4 class = "card-title">';
  card += recipeName + '</h4><p class = "card-text">Ready in: ' + recipeMins + '</p>';
  card += '<p class = "card-text" font-size = "smaller">' + recipeDesc + '</p> <br>';
  card += '<a class = "btn btn-primary" href = ' + recipeUrl + ' role = "button">Go to Recipe</a><br><br>';
  card += '<button type="button" class="btn btn-danger" onclick= "removeRecipe('+ recipeID+')">Remove from Inventory</button>'
  card += "</div></div></div>";
  return card;
}

//whenever the profile page is loaded, it invoked both functions
$("document").ready(() =>{
	if($('body').is('.profile')){
      getProfileInfo()
      getUserCards()
    }
})
