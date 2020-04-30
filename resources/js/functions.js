
console.log("Loaded functions.js");
var apiKey= "ac9d1996174844fa8bd9d2ba7b497976";
var currentID=0;

function testWebToken(){
  // This will make an ajax call with the token stored in local storage.
  // If there is a valid token the response should print out the username in the
  // browser console. This is all handled in the authenticateJWT middleware function.
    $.ajax({
        url: "http://localhost:3000/profile_info",
        type: 'GET',
        // Fetch the stored token from localStorage and set in the header
        headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    }).done((response) => {
      // do stuff with response
      console.log(response)
      console.log("Look, you can now authenticate!")
    });
}

// function loginButton(){ //alerts the user if their username or password is wrong
//   $.ajax({
//     url: "http://localhost:3000/profile_info",
//     type: 'GET',
//     // Fetch the stored token from localStorage and set in the header
//     headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
//   }).done((response) => {
//   // do stuff with response
//   if(response.authenticated==false)
//   {
//     alert('Wrong Username or Password!');
//   }
// });
// }


$(document).ready(() => {
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

$(document).ready(() => {
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

// $(document).ready(() => {
//   // I added a body tag to your profile page.
//   // If this page loads, it will run the testWebToken() function
//   if($('body').is('.profile')){
//     console.log("Home loaded")
//     testWebToken()
//   }
// })

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
  })
}

function addRecipeToInv()
{
  console.log(currentID);
  $.ajax({
      url: "http://localhost:3000/add",
      type: 'POST',
      data: {id: currentID},
      //id: currentID,
      // Fetch the stored token from localStorage and set in the header
      headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
  }).done((response) => {
    // if(response.success==true)
    // {
    //   alert("Recipe successfully added to your inventory.");
    // }else{
    //   alert("There was an error trying to add this recipe!");s
    // }
  });
}
