function loadDefaultProfile(){
	// just put generic pictures or emails etc,. 
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
      	    $('profile_img').setImage(response.imgURL);
      		$('#email').html(response.html)
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