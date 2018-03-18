/*  npm packages:
 *    https://www.npmjs.com/package/twitter
 *    https://www.npmjs.com/package/node-spotify-api
 *    https://www.npmjs.com/package/request
 *    https://www.npmjs.com/package/dotenv
 */

// Import env variables, packages
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");
var request = require('request');

// Initialize packages with env var configs
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Declare variables for arguments
const command = process.argv[2];
const param = process.argv[3];

// For debugging
// console.log(`Command is: ${command}`);
// console.log(`Param is: ${param}`);

/*  Twitter | $ node liri.js my-tweets
 *  Docs: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
 */
if (command === 'my-tweets') {
  // Establish query parameters
  var params = {
    screen_name: 'SeeBenProgram',
    count: 20
  };
  // Make GET request based on parameters
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (let tweet of tweets) {
        // Log tweets
        console.log(`\nOn ${tweet.created_at}, ${tweet.user.screen_name} tweeted:\n'${tweet.text}'`);
      }
    } else {
      console.log(error);
    }
  });
}

/*  Spotify | $ node liri.js spotify-this-song '<song name here>'
 *  Docs: 
 *  
 */
if (command === 'spotify-this-song') {
  let songName = param || 'The Sign';
}

// OMDB - 'movie-this' | node liri.js movie-this '<movie name here>'
if (command === 'movie-this') {

}

// <random.txt file command> - 'do-what-it-says' | node liri.js do-what-it-says
if (command === 'do-what-it-says') {

}
