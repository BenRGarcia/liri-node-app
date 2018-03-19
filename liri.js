/*********************************************
 * Import dependencies & Instantiate modules *
 *********************************************/
// Environment variables
require("dotenv").config();
const keys = require("./keys.js");
// Twitter
const Twitter = require('twitter');
const twitter = new Twitter(keys.twitter);
const SearchTwitter = require('./searchTwitter');
const searchTwitter = new SearchTwitter();
// Spotify
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const SearchSpotify = require('./searchSpotify');
const searchSpotify = new SearchSpotify();
// OMDB
const request = require('request');
const SearchOMDB = require('./searchOMDB');
// Data logging
const fs = require('fs');
const DataLogger = require('./dataLogger');
const dataLogger = new DataLogger();
// Command Parser
const ParseCommand = require('./parseCommand');
const parseCommand = new ParseCommand();

/*********************************
 * JS Logic to Handle User Input *
 *********************************/
// Declare variables for arguments passed
let command = process.argv[2];
let param = process.argv[3];

// Create object to store command & param
let commandObj = { command, param };

// Call function to route command
routeCommand(commandObj);

// A function to route command based on its value
function routeCommand(commandObj) {
  switch (commandObj.command) {
    case 'my-tweets':
      // Define (hard coded) Twitter search parameters
      let paramObj = { screen_name: 'SeeBenProgram', count: 20 };
      // Execute GET request
      let results = searchTwitter.search(paramObj);
      // Log results
      dataLogger.log(results);
      break;
    case 'spotify-this-song':
      searchSpotify(param);
      break;
    case 'movie-this':
      searchOMBD(param);
      break;
    case 'do-what-it-says':
      // Declare variable for file to be parsed
      let fileToParse = './random.txt';
      // Parse new command & param from fileToParse
      let newCommandObj = parseCommand.parse(fileToParse);
      // Recursive call to routeCommand
      routeCommand(newCommandObj);
      break;
    default:
      console.log(`Invalid command: '${commandObj.command}'`);
      break;
  }
}

/*  Spotify | $ node liri.js spotify-this-song '<song name here>'
 *  Docs: https://beta.developer.spotify.com/documentation/web-api/
 */
function searchSpotify(param) {
  if (param) {
    spotify.search({
      type: 'track',
      query: param,
      limit: 1
    }, function (err, data) {
      if (!err) {
        let track = data.tracks.items[0];
        console.log(`\n Artist name: ${track.artists[0].name}`);
        console.log(`  Album name: ${track.album.name}`);
        console.log(`   Song name: ${track.name}`);
        console.log(`Preview link: ${track.preview_url || '(not available)'}`);
        logToFile(`\n Artist name: ${track.artists[0].name}\n  Album name: ${track.album.name}\n   Song name: ${track.name}\nPreview link: ${track.preview_url || '(not available)'}\n`);
      } else {
        console.log(err);
      }
    });
  } else {
    let queryURL = 'https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc';
    spotify
      .request(queryURL)
      .then(function (data) {
        console.log(`\n Artist name: ${data.artists[0].name}`);
        console.log(`  Album name: ${data.album.name}`);
        console.log(`   Song name: ${data.name}`);
        console.log(`Preview link: ${data.preview_url}`);
        logToFile(`\n Artist name: ${data.artists[0].name}\n  Album name: ${data.album.name}\n   Song name: ${data.name}\nPreview link: ${data.preview_url}\n`);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

/*  OMDB | $ node liri.js movie-this '<movie name here>'
 *  Docs: http://www.omdbapi.com/
 */
function searchOMBD(param) {
  let movieName = param || 'Mr. Nobody';
  let queryName = movieName.replace(' ', '+');
  let queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movieName;
  request(queryURL, function (err, response, body) {
    if (!err) {
      let movie = JSON.parse(body);
      console.log(`\n              Movie Title: ${movie.Title}`);
      console.log(`                     Year: ${movie.Year}`);
      console.log(`              IMDB Rating: ${movie.Ratings[0].Value}`);
      console.log(`   Rotten Tomatoes Rating: ${movie.Ratings[1].Value}`);
      console.log(`Country in which Produced: ${movie.Country}`);
      console.log(`                 Language: ${movie.Language}`);
      console.log(`                   Actors: ${movie.Actors}`);
      console.log(`                     Plot: ${movie.Plot}`);
      logToFile(`\n              Movie Title: ${movie.Title}\n                     Year: ${movie.Year}\n              IMDB Rating: ${movie.Ratings[0].Value}\n   Rotten Tomatoes Rating: ${movie.Ratings[1].Value}\nCountry in which Produced: ${movie.Country}\n                 Language: ${movie.Language}\n                   Actors: ${movie.Actors}\n                     Plot: ${movie.Plot}\n`);
    } else {
      console.log(err);
    }
  });
}
