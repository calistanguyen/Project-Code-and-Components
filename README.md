# Tender 
Tender is an online web application designed to help college students figure out what to eat. Inspired from our indecision, Tender
is your online dating web app for recipes. The home page generates random recipe cards that you can choose to save to your inventory, see
a new recipe, or go directly to the recipe's page. If you create an account, your saved recipes are stored in your profile so that
you are able to view them another time. 

In this project, we utilized PostgreSQL for our database server, NodeJS, JWT, and Spoonacular. 

# How to use the build
To run this application, you can download all of the files or clone the repository and run a Node.js server from your local machine.<br/> You need to have Node.js installed, and you must create your own .env file for environment variables.
<br/>For your Postgres server, we have a .sql file in the /resources/database folder that you can use to set up your server with the correct format.
<br/>You will also need your own instance of the spoonacular API. This resource is free and only requires you to sign up.

### List of variables for a .env file
* DATABASE_HOST     (*generally localhost*)
* DATABASE_PORT     (*whatever port you host your PSQL server on*)
* DATABASE_NAME     (*name of the database you created*)
* DATABASE_USER     (*your PC's username*)
* DATABASE_PASSWORD (*this can be set in the Postgres settings*)
* API_KEY           (*your personal API key provided by spoonacular*)
* TOKEN_SECRET      (*this can be whatever you choose, this is used for JWT token encryption*)

##### Note: In the functions.js file you will need to copy-paste your own API key into the apiKey variable. This was a caveat with one of our functions.

# Deployment
You can also access our own website [here.](https://group6-finalproject-tender.herokuapp.com/)<br/>
This is our personal deployment through Heroku that you can access and use at any time!
