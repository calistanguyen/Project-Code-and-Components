// function addRecipe(recipe)
// {
//     var recipeName = document.getElementById(recipe);
//     var menu = document.getElementById("recipe_select");
//     var added = document.createElement("a");
//     added.setAttribute('class', "dropdown-item");
//     added.setAttribute('href',"#");
//     added.innerText = recipeName.textContent;
//     menu.appendChild(added);

// }

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
