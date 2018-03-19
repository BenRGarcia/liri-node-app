/*********************************************
 * Import dependencies & Instantiate modules *
 *********************************************/
// Environment variables
require("dotenv").config();
const keys = require("./keys.js");
// Dependencies
const request = require('request');
const fs = require('fs');
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
const SearchOMDB = require('./searchOMDB');
const searchOMDB = new SearchOMDB();
// Data logging
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
let param = process.argv[3] || false;

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
      searchTwitter.search(paramObj).then( response => {
        // Log response when received
        dataLogger.log(response);
      }, err => {
        console.log(err);
      });
      break;
    case 'spotify-this-song':
      searchSpotify.search(commandObj.param).then( response => {
        // Log response when received
        dataLogger.log(response);
      }, err => {
        console.log(err);
      });
      break;
    case 'movie-this':
      // Execute Get request
      searchOMBD.search(commandObj.param).then( response => {
        // Log response when received
        dataLogger.log(response);
      }, err => {
        console.log(err);
      });
      break;
    case 'do-what-it-says':
      // Declare variable for file to be parsed
      let fileToParse = './random.txt';
      // Parse new command & param from fileToParse
      parseCommand.parse(fileToParse).then( response => {
        // Recursive call to routeCommand
        routeCommand(response);
      }, err => {
        console.log(err);
      });
      break;
    default:
      console.log(`Invalid command: '${commandObj.command}'`);
      break;
  }
}
