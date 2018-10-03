var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiroutes = require('./apiroutes/apiroutes');
var port = process.env.PORT || 3000;
var compression = require('compression');
var appconfig = require('./appconfig');
require('./dbmodel/accountmodel.js')
// GZIP all assets
app.use(compression());

//Setup and Connect to MongoDb
var mongoose = require('mongoose');
var options = {
  useNewUrlParser : true
}
mongoose.connect(appconfig.mongo, options, function(error){
  if (error) {
    return
  }
  console.log("DB is connected")
})

//CORS middleware
var allowCrossDomain = function(req, res, next) {
	cors = {
    origin: [
      "https://yslavovgiphyapp.herokuapp.com",
      "http://localhost:3000"
    ],
    traditional: "https://maps.googleapis.com/"
  }

  //console.log("HEADERS",req.headers);
	var origin = cors.origin.indexOf(req.headers.origin) > -1 ? req.headers.origin : cors.traditional;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use('/v1/', apiroutes);

app.use(express.static(__dirname + '/app'));
app.set('case sensitive routing', false);
app.set('views', __dirname + '/app');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('*', function(req, res){
	res.render('index');
});

app.listen(port);
console.log('Server listening on port', port);