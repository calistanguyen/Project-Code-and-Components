function loadDefaultProfile(){
  // just put generic pictures or emails etc,.
  document.getElementById('name').innerText = "You have not logged in yet!";
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
        console.log('YESSS');
      	  $('#name').html(response.name); //id
          $('#user').html(response.username);
      } else {
		      loadDefaultProfile();
      }

    });
}

$("document").ready(() =>{
	if($('body').is('.profile')){
    	getProfileInfo()
    }
})
