// Import env variables, packages
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");
var request = require('request');

// Initialize packages with env var config
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Declare variables for arguments
const command = process.argv[2];
// const param = process.argv[3];

// For debugging
// console.log(`Command is: ${command}`);
// console.log(`Param is: ${param}`);

/*  npm packages:
 *    https://www.npmjs.com/package/twitter
 *    https://www.npmjs.com/package/node-spotify-api
 *    https://www.npmjs.com/package/request
 *    https://www.npmjs.com/package/dotenv
 */

// Twitter - 'my-tweets' | node liri.js my-tweets
if (command === 'my-tweets') {
  var params = { screen_name: 'SeeBenProgram' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (let tweet of tweets) {
        console.log(tweet.text);
      }
    }
  });
}

// Spotify - 'spotify-this-song' | node liri.js spotify-this-song '<song name here>'
if (command === 'spotify-this-song') {

}

// OMDB - 'movie-this' | node liri.js movie-this '<movie name here>'
if (command === 'movie-this') {

}

// <random.txt file command> - 'do-what-it-says' | node liri.js do-what-it-says
if (command === 'do-what-it-says') {

}
