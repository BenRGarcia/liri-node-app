/*********************************************
 * Import dependencies & Instantiate modules *
 *********************************************/
// Twitter
const SearchTwitter = require('./custom_modules/searchTwitter');
const searchTwitter = new SearchTwitter();
// Spotify
const SearchSpotify = require('./custom_modules/searchSpotify');
const searchSpotify = new SearchSpotify();
// OMDB
const SearchOMDB = require('./custom_modules/searchOMDB');
const searchOMDB = new SearchOMDB();
// Data logging
const DataLogger = require('./custom_modules/dataLogger');
const dataLogger = new DataLogger();
// Command Parser
const ParseCommand = require('./custom_modules/parseCommand');
const parseCommand = new ParseCommand();

/*********************************
 * JS Logic to Handle User Input *
 *********************************/
// Call function to route command
routeCommand({
  command: process.argv[2],
  param: process.argv[3] || false
});

// A function to route command based on its value
function routeCommand(commandObj) {
  switch (commandObj.command) {
    case 'my-tweets':
      // Define (hard coded) Twitter search parameters
      let paramObj = { screen_name: 'SeeBenProgram', count: 20 };
      // Execute GET request
      searchTwitter.search(paramObj).then( response => {
        // Log response when received
        console.log(`Response received from inside of liri.js`);
        console.log(response);
        // dataLogger.log(response);
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
