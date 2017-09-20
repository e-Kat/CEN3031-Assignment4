/* Navigate to `server/config/express.js`. 
This is where you will place code to configure your Express application. 
The **morgan** module is used to log requests to the console for debugging purposes. 
The **body parser** module is middleware that will allow you to access any data 
sent in requests as `req.body`. 
*/
var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'), 
    getCoordinates = require('../controllers/coordinates.server.controller.js');

module.exports.init = function() {
  //connect to database
  var db = mongoose.connect(config.db.uri, { useMongoClient: true, /* other options */ });
  //mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware 
  app.use(bodyParser.json());

  /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
  app.post('/api/coordinates', getCoordinates, function(req, res) {
    res.send(req.results);
  });

  /* serve static files */
  app.use('/', express.static('client'));

  /* use the listings router for requests to the api */
  app.use('/api/listings', listingsRouter);

  /* go to homepage for all routes not specified */ 
  app.get('*', function(req, res) {
    res.redirect('/');
  });

  return app;
};  