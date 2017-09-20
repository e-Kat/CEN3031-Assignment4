/*In `server/routes/listings.server.routes.js`, 
you will find code that specifies the request handlers for CRUD tasks. 
To learn more about the Express router, [go to this page]
(http://expressjs.com/en/guide/routing.html) and scroll down to the section on *express.Router.**/
//<script async defer src='//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=false'></script>
/* Dependencies */
var listings = require('../controllers/listings.server.controller.js'), 
    getCoordinates = require('../controllers/coordinates.server.controller.js'),
    express = require('express'), 
    router = express.Router();


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 */
router.route('/')
  .get(listings.list)
  .post(getCoordinates, listings.create);

/*
  The ':' specifies a URL parameter. 
 */
router.route('/:listingId')
  .get(listings.read)
  .put(getCoordinates, listings.update)
  .delete(listings.delete);

/*router.route('/about').get(function (req, res) {
  console.log('/about hit');
  res.send('about');
});*/
/*
  The 'router.param' method allows us to specify middleware we would like to use to handle 
  requests with a parameter.

  Say we make an example request to '/listings/566372f4d11de3498e2941c9'

  The request handler will first find the specific listing using this 'listingsById' 
  middleware function by doing a lookup to ID '566372f4d11de3498e2941c9' in the Mongo database, 
  and bind this listing to the request object.

  It will then pass control to the routing function specified above, where it will either 
  get, update, or delete that specific listing (depending on the HTTP verb specified)
 */
router.param('listingId', listings.listingByID);

module.exports = router;