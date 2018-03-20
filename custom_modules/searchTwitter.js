// Environment variables
require("dotenv").config();
const keys = require("../keys.js");
// Require/Instantiate packages
const Twitter = require('twitter');
const twitter = new Twitter(keys.twitter);

// SearchTwitter Constructor
var SearchTwitter = function() {};

// Returns object of tweets
SearchTwitter.prototype.search = function (paramsObj) {

  // Return promise to caller, make function '.then()able'
  return new Promise ((resolve, reject) => {

    // Declare path of Twitter API endpoint to query
    let path = 'statuses/user_timeline';

    // Create empty object to store tweets
    let results = {};

    // Make API call
    twitter.get(path, paramsObj, (err, tweets, response) => {

      // Error handling
      if (err) reject(err);

      // Iterate over tweets
      for (let tweet of tweets) {

        // Declare variables for parsed data
        let date = tweet.created_at;
        let name = tweet.user.screen_name;
        let text = tweet.text;

        // Add property to results object, date as key
        results[date] = { date, name, text };
      }
      
      // Promise resolved
      resolve(results);
    });
  });
}

module.exports = SearchTwitter;
