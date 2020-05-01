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
        url: "http://localhost:3000/profile_info",
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
function getUserCards()
{
  $.ajax({
    url: "http://localhost:3000/profile_recipes",
    type: 'GET',
    // Fetch the stored token from localStorage and set in the header
    headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    }).done((response) => {
      if(response.authenticated==true)
      {
        var cards= "";
        console.log(response);
        response.recipe_arr.forEach(recipe=>{

          cards += buildCards(recipe.sourceUrl, recipe.image, recipe.title, recipe.summary, recipe.readyInMinutes);
        })
        $('#myrecipes').html(cards);
        //load the recipes into HTML
      }else {
          return;
      }
    });
}

function buildCards(recipeUrl, recipeImg, recipeName, recipeDesc, recipeMins){
  //build a card
  var card= '';
  card += '<div class = "card"> <div class = "row"> <div class = "col-md-4"> <img src = ';
  card += recipeImg + ' class = "w-100">  </div>  <div class = "col-md-8 px-3"><h4 class = "card-title">';
  card += recipeName + '</h4><p class = "card-text">Ready in: ' + recipeMins + '</p>';
  card += '<p class = "card-text" font-size = "smaller">' + recipeDesc + '</p> <br>';
  card += '<a class = "btn btn-primary" href = ' + recipeUrl + ' role = "button">Go to Recipe</a>';
  card += "</div></div></div>";
  return card;
}


$("document").ready(() =>{
	if($('body').is('.profile')){
      getProfileInfo()
      getUserCards()
    }
})
