function openModal() {
    /* Note that you do NOT have to do a document.getElementById anywhere in this exercise. Use the elements below */        
    var myInput = document.getElementById("password");
    var confirmMyInput = document.getElementById("confpassword");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");    
    var match = document.getElementById("match");


	// When the user starts to type something inside the password field
	myInput.onkeyup = function() {

       console.log('helllooo')
        
        /* TODO: Question 1.1: Starts here */
        var lowerCaseLetters = /[a-z]/; // : Fill in the regular experssion for lowerCaseLetters
        var upperCaseLetters = /[A-Z]/; // : Fill in the regular experssion for upperCaseLetters
        var numbers = /[0-9]/; // : Fill in the regular experssion for digits
        var minLength = 8; // : Change the minimum length to what what it needs to be in the question 
      
        // Validate lowercase letters
        console.log(letter.classList)
        if(myInput.value.match(lowerCaseLetters)) {             
            letter.classList.remove("invalid"); 
            letter.classList.add("valid"); 
        } else {
            letter.classList.remove("valid"); 
            letter.classList.add("invalid"); 
        }

        // Validate capital letters        
        if(myInput.value.match(upperCaseLetters)) { 
            capital.classList.remove("invalid"); 
            capital.classList.add("valid");
        } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
        }

        // Validate numbers        
        if(myInput.value.match(numbers)) { 
            number.classList.remove("invalid"); 
            number.classList.add("valid"); 
        } else {
            number.classList.remove("valid"); 
            number.classList.add("invalid");
        }

        // Validate length
        if(myInput.value.length >= minLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }

    }
    confirmMyInput.onkeyup = function() {
                // Validate password and confirmPassword
            
                var passEqualsConfPass = (confirmMyInput.value == myInput.value); // TODO: Change this to the condition that needs to be checked so that the text entered in password equals the text in confirm password
                console.log(passEqualsConfPass);
                if(passEqualsConfPass) { 
                    match.classList.remove("invalid"); 
                    match.classList.add("valid"); 
                } else {
                    match.classList.remove("valid"); 
                    match.classList.add("invalid"); 
                }        
    /* TODO Question 1.3: Starts here */

                // Disable or Enable the button based on the elements in classList
                enableButton(letter, capital, number, length, match);

    }
    user = document.getElementById("username");
}


function enableButton(letter, capital, number, length, match) {
    // TODO: Clear this function for students to implement    
    var button = document.getElementById('submit_signup');
    var condition = (letter.classList.contains("valid") && capital.classList.contains("valid")) && number.classList.contains("valid") && length.classList.contains("valid") && match.classList.contains("valid"); // TODO: Replace false with the correct condition
    if(condition) {       
            button.disabled = false;
        }
    else
    {
        button.disabled = true; 
    }          
}  


function onClickFunction() {
    alert("Hey! I'm all green! Well done.")
}