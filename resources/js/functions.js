
console.log("Loaded functions.js");
var apiKey= process.env.API_KEY;
var currentID=0;

$(document).ready(() => {//every time the login form is submitted, this intercepts the form info and sends it to the endpoint on the server
  $("#loginform").submit((event) => {
    /* stop form from submitting normally */
    event.preventDefault();
    var form = $("#loginform");
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done((response) => {
      console.log(response);
      if(response.success == true){
        localStorage.setItem('token', response.accessToken);
        location.href="/profile";
      }else{
        alert('Wrong username or password!');
        location.href = "/home";
      }
      });
    });
})

$(document).ready(() => { //intercepts the signup form information when submitted and sends it to the server to be added to the database
  $("#signupform").submit((event) => {
    /* stop form from submitting normally */
    event.preventDefault();
    var form = $("#signupform");
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done((response) => {
      localStorage.setItem('token', response.accessToken);
      location.href = "/home";
      });
    });
})

function setCurrID(id)
{
  currentID=id;
}

function goToRecipe()//reroutes to the recipe page with the currentID
{
  if(currentID==0){
    alert('Please select a recipe before attempting to view.');
    return;
  }
  //reroutes the pages to the recipe page with the given recipe's ID
  window.location.href="/recipe?id="+currentID;
}

function randomizeRecipe()//when a user click the Get Random Recipe button on the homepage, this function calls out the spoonacular API for a random recipe
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
  })
}

function addRecipeToInv()//takes the currentID of the recipe that is being displayed and sends it to the server to be added to the database
{
  console.log(currentID);
  console.log(localStorage.getItem('token'));
  if(localStorage.getItem('token')==null)
  {
    alert('You need to be logged in to add recipes to your inventory!');
    return;
  }
  if(currentID==0)
  {
    alert('Please choose a recipe before adding!');
    return;
  }
  $.ajax({
      url: "http://localhost:3000/add",
      type: 'POST',
      data: {id: currentID},
      //id: currentID,
      // Fetch the stored token from localStorage and set in the header
      headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
  }).done((response) => {
    if(response.success==true)
    {
      alert("Recipe successfully added to your inventory.");
    }else{
      alert("There was an error trying to add this recipe!");s
    }
  });
}
function logout()
{
  localStorage.removeItem('token');
}

function removeRecipe(remove_id)//removes a specified recipe from a users saved recipes
{
  console.log("Remove ID:" + remove_id);
  $.ajax({
      url: "http://localhost:3000/remove",
      type: 'POST',
      data: {id: remove_id},
      //id: currentID,
      // Fetch the stored token from localStorage and set in the header
      headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
  }).done((response) => {
    if(response.success==true)
    {
      alert("Recipe successfully removed from your inventory.");
    }else{
      alert("There was an error trying to remove this recipe!");
    }
  });
}
