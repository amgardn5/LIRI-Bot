require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// get the command line args

