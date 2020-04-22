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
    $.ajax({
        url: "http://localhost:3000/books",
        type: 'GET',
        // Fetch the stored token from localStorage and set in the header
        headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    });
}

function completeAndRedirect(){
    $.ajax({
        url: "http://localhost:3000/books",
        type: 'GET',
        // Fetch the stored token from localStorage and set in the header
        headers: {"Authorization": "Bearer " +  localStorage.getItem('token')}
    });
}

function successLogin(response){
    console.log(response)
    
    // we'll set the token to localStorage
    // localStorage.setItem('token') = response.token ??
    
    $.ajax({
     url: "http://localhost:3000/home",
     type: 'GET',
     // Fetch the stored token from localStorage and set in the header
     headers: {"Authorization": localStorage.getItem('token')}
    });
}

// $.ajax({
//     type: 'POST',
//     url: $("form").attr("action"),
//     data: $("form").serialize(),
//     success: successLogin(response)
//   });

  $("form").submit(function() {
      console.log('is this working???');

    /* stop form from submitting normally */

    var $theForm = $(this);
    $.ajax({
        type: $theForm.attr('method'),
        url: $theForm.attr('action'),
             data: $theForm.serialize(),
             success: function(data) {
                 console.log('Yay! Form sent.');
                 }
                });

    return false; 

    /* get the action attribute from the <form action=""> element */
    // var $form = $( this ),
    //     url = $form.attr( 'action' );

    // /* Send the data using post with element id name and name2*/
    // var posting = $.post( url, { uname: $('#uname').val(), pword: $('#pword').val() }, );

    // /* Alerts the results */
    // posting.done(function( data ) {
    //   console.log(data);
    // });
  });