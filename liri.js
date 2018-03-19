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
var fs = require('fs');

// Initialize packages with env var configs
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Declare variables for arguments
let command = process.argv[2];
let param = process.argv[3];

// Call function to route command
routeCommand(command, param);

function routeCommand(command, param) {
  switch (command) {
    case 'my-tweets':
      searchTwitter();
      break;
    case 'spotify-this-song':
      searchSpotify(param);
      break;
    case 'movie-this':
      searchOMBD(param);
      break;
    case 'do-what-it-says':
      evaluateCommand(command);
      break;
    default:
      console.log(`Invalid command: '${command}'`);
      break;
  }
}

/*  Twitter | $ node liri.js my-tweets
 *  Docs: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
 */
function searchTwitter() {
  // Establish query parameters
  let params = {
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
 *  Docs: https://beta.developer.spotify.com/documentation/web-api/
 */
function searchSpotify(param) {
  // If user provided song name
  if (param) {
    spotify.search({
      type: 'track',
      query: param,
      limit: 1
    }, function (error, data) {
      if (!error) {
        // Log song details
        console.log(`\n Artist name: ${data.tracks.items[0].artists[0].name}`);
        console.log(`  Album name: ${data.tracks.items[0].album.name}`);
        console.log(`   Song name: ${data.tracks.items[0].name}`);
        console.log(`Preview link: ${data.tracks.items[0].preview_url || '(not available)'}`);
      } else {
        console.log(error);
      }
    });
  }
  // If user did not provide song name
  else {
    // Default if no 'param': Ace of Base 'The Sign'
    let queryURL = 'https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc';
    spotify
      .request(queryURL)
      .then(function (data) {
        // Log song details
        console.log(`\n Artist name: ${data.artists[0].name}`);
        console.log(`  Album name: ${data.album.name}`);
        console.log(`   Song name: ${data.name}`);
        console.log(`Preview link: ${data.preview_url}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

/*  OMDB | $ node liri.js movie-this '<movie name here>'
 *  Docs: http://www.omdbapi.com/
 */
function searchOMBD(param) {
  // Sanitize Movie Title, add fallback if no movie name provided
  let movieName = param || 'Mr. Nobody';
  let queryName = movieName.replace(' ', '+');
  let queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movieName;

  request(queryURL, function (error, response, body) {
    if (!error) {
      // console.log(JSON.parse(body));
      let movie = JSON.parse(body);
      console.log(`\n              Movie Title: ${movie.Title}`);
      console.log(`                     Year: ${movie.Year}`);
      console.log(`              IMDB Rating: ${movie.Ratings[0].Value}`);
      console.log(`   Rotten Tomatoes Rating: ${movie.Ratings[1].Value}`);
      console.log(`Country in which Produced: ${movie.Country}`);
      console.log(`                 Language: ${movie.Language}`);
      console.log(`                   Actors: ${movie.Actors}`);
      console.log(`                     Plot: ${movie.Plot}`);
    } else {
      console.log(error);
    }
  });
}

/*  <random.txt file command> | $ node liri.js do-what-it-says
 *  Docs: https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_file_system
 *        https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_fs_readfile_path_options_callback
 */
function evaluateCommand() {
  fs.readFile('./random.txt', 'utf8', (err, data) => {
    if (err) throw err;
    let array = data.split(',');
    command = array[0];
    param = array[1];
    routeCommand(command, param);
  });
}
