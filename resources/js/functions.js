console.log("Loaded functions.js");

function addRecipe(recipe)
{
    var recipeName = document.getElementById(recipe);
    var menu = document.getElementById("recipe_select");
    var added = document.createElement("a");
    added.setAttribute('class', "dropdown-item");
    added.setAttribute('href',"#");
    added.innerText = recipeName.textContent;
    menu.appendChild(added);

}

function goToRecipe()
{
  var id= 655098;
  
}
