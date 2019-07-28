require("dotenv").config();
const axios = require("axios");
const dotenv = require('dotenv');
const moment = require("moment");
const Spotify = require("node-spotify-api");
var keys = require("./keys.js");
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

// get the command line args

const args = process.argv;
if (args.length == 2){
    process.exit(1);
}

// check the command
switch(args[2]){
    case "concert-this":
        if (args.length <= 3){
            console.log("Please provide the name of the artist/band. Example: ");
            console.log("node liri.js concert-this 'artist/band'");
            process.exit(0);
        }
        concert(args[3]);
        break;
    case "spotify-this-song":
        if (args.length <= 3){
            spotifySong("The Sign");
            break;
        }
        spotifySong(args[3]);
        break;
    case "movie-this":
        if (args.length <= 3){
            movies("Mr. Nobody");
            break;
        }
        movies(args[3]);
        break;
    case "do-what-it-says":
        randomFile();
        break;
}

function concert(artist){
    axios.get("https://rest.bandsintown.com/artists/"+artist +"/events?app_id=codingbootcamp").then(response => {
        let data = response.data;
        for (let i = 0; i < data.length; i++){
            let venue_name = data[i].venue.name;
            let location = data[i].venue.city + ", " + data[i].venue.region;
            let date = moment(data[i].datetime).format("MM/DD/YYYY HH:mm"); // use moment.js

            console.log("Venue: " + venue_name);
            console.log("Location: " + location);
            console.log("Date: " + date);
            console.log("\n");
        }
    });
};


function spotifySong(name){
    spotify.search({
        type: 'track',
        query: name, 
        limit: 1
    }).then(function(response) {
        let info = response.tracks.items;

        for (let i = 0; i < info.length; i++){
            let artist = info[i].artists[0].name;
            let song_name = info[i].name;
            let album = info[i].album.name;
            let link = info[i].href;

            console.log("Song name: " + song_name);
            console.log("Artist: " + artist);
            console.log("Album: " + album);
            console.log("Link: " + link);
            console.log();
        }

    }).catch(function (err){
        console.log(err);
    });
};

function movies(name){
    axios.get("http://www.omdbapi.com/?t="+name+"&y=&plot=short&apikey=trilogy").then(response => {
        let data = response.data;
        let title = data.Title;
        let year = data.Year;
        let imdb_rating = data.imdbRating;
        let tomato = data.Ratings[1].Value;
        let country = data.Country;
        let language = data.Language;
        let plot = data.Plot;
        let actors = data.Actors;

        console.log("Title: " + title);
        console.log("Year: " + year);
        console.log("IMDB Rating: " + imdb_rating);
        console.log("Rotten Tomatoes: " + tomato);
        console.log("Country: " + country);
        console.log("Language: " + language);
        console.log("Plot: " + plot);
        console.log("Actors: " + actors);
    });
};

function randomFile(){
    fs.readFile("random.txt", 'utf8', read = (err, data) => {
        if (err) {
            console.log("Error opening random.txt file");
            process.exit(1);
        }

        let line_splitted = data.trim().split(",");
        switch (line_splitted[0]){
            case "concert-this":
                concert(line_splitted[1]);
            break;
            case "spotify-this-song":
                spotifySong(line_splitted[1]);
            break;
            case "movie-this":
                movies(line_splitted[1]); 
            break;
            case "do-what-it-says":
                randomFile();
            break;
        }
    });
};
