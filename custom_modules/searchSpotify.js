// Environment variables
require("dotenv").config();
const keys = require("../keys.js");
const request = require('request');
// Instantiate Modules
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

// SearchSpotify Constructor
const SearchSpotify = function() {};

// Returns Spotify song object for given trackName (or if trackName not given, returns 'The Sign' by Ace of Base)
SearchSpotify.prototype.search = function(trackName) {

  // Return a Promise to the caller
  return new Promise((resolve, reject) => {

    // This search to execute if trackName provided
    let trackNameSearch = function (trackName) {
      // Create object of Spotify search parameters
      let params = { type: 'track', query: trackName, limit: 1 };
      // Make API call
      return spotify.search(params, (err, response) => {
        // Error handling
        if (err) reject(err);
        // Declare variable from response object
        let track = response.tracks.items[0];
        // Return processed object from objFactory
        resolve(objFactory(track));
      });
    };

    // This search to execute if trackName not provided
    let aceOfBaseSearch = function () {
      // Hard coded query URL for Ace of Base 'The Sign'
      let queryURL = 'https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc';
      // Make API call
      return spotify.request(queryURL).then(response => {
        // Return processed object from objFactory
        resolve(objFactory(response));
      }, err => {
        reject(err);
      });
    };

    // Returns 'results' object from API response, to be passed up chain of callers
    let objFactory = function (response) {
      // Create empty object to store Spotify track object
      let results = {};
      // Assemble results object, song name as key
      results[response.name] = {
        "Artist Name": response.artists[0].name,
        "Album Name": response.album.name,
        "Song Name": response.name,
        "Preview Link": response.preview_url || "(not available)"
      };
      return results;
    };

    // Call function depending on whether trackName passed
    trackName
      ? trackNameSearch(trackName)
      : aceOfBaseSearch();
  });
};

module.exports = SearchSpotify;