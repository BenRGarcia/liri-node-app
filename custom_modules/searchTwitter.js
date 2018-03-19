// Environment variables
require("dotenv").config();
const keys = require("../keys.js");
// Instantiate Modules
const Twitter = require('twitter');
const twitter = new Twitter(keys.twitter);

// SearchTwitter Constructor
var SearchTwitter = function() {};

// Returns object of tweets
SearchTwitter.prototype.search = function (paramsObj) {
  console.log(`.search called with params Obj:`);
  console.log(paramsObj);
  // Declare path of Twitter API endpoint to query
  let path = 'statuses/user_timeline';
  // Create empty object to store tweets
  let results = {};
  // Make API call, return results object
  return twitter.get(path, paramsObj, (err, tweets, response) => {
    // Error handling
    if (err) throw err;
    // Iterate over tweets
    for (let tweet of tweets) {
      // Declare variables for parsed data
      let date = tweet.created_at;
      let name = tweet.user.screen_name;
      let text = tweet.text;
      // Add property to results object, date as key
      results[date] = { date, name, text };
    }
    return results;
  });
}

module.exports = SearchTwitter;