Giphy APP can be seen at https://yslavovgiphyapp.herokuapp.com/

please feel free to create user accounts, login in and browse favorite giphies.

Get a copy of the Giphy App by simply clonning this repo.
You will be able to run the app locally on you machine by following the steps below.


Install NODEJS on you system if you don't have it already. This is the only dependency for this project.

Once Node is installed, CD to the repo home page and run commands:

1. npm install
2. grunt (optional since this repo already has the minified js and css verions but if you apply changes you have to run grunt)
3. node server.js  - this will start the server.
4. load in your browser http://localhost:3000

Architecture  and Technology Details:

 - UI: JavaScript, AngularJS, Angular Bootstrap, CSS, HTML, Session Token in window.sessionStorage, responsive design
 - Server Side: JavaScript, NodeJS, Express, Mongoose, REST API, Crypto
 - DB: MongoDB, instance is running at mlab.com

APP Features:
 - users to create accounts
 - user can search giphies against GIPHY API
 - user can created categories to save favorite giphies
 - user is able to load & veiw saved giphies by category

