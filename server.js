// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var dbURL      = 'mongodb://localhost:27017/nodetester';
var Knight     = require('./app/models/knight');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(dbURL);

mongoose.connection.on('connected', function () {
  console.log('DB open');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('DB error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('DB disconnected');
});

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'Welcome to API!' });
});

// create a knight (accessed at POST http://localhost:8080/api/knights)
router.route('/knights')
  .post(function (req, res) {
    var knight = new Knight();
    knight.name = req.body.name;

    // save the knight and check for errors
    knight.save(function (err) {
      if (err)
        res.send(err);

      res.json({ message: 'Knight has been created!' });
    });
  })

  // get all the knights (accessed at GET http://localhost:8080/api/knights)
  .get(function (req, res) {
    Knight.find(function (err, knights) {
      if (err)
        res.send(err);

      res.json(knights);
    });
  })

  .get(function (req, res) {
    Knight.findById(req.params.knight_id, function (err, knight) {
      if (err)
        res.send(err);

      res.json(knight);
    });
  });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Now serving on ' + port);
