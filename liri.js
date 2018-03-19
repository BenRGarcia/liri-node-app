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

// A function to route command based on its value
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
  let params = {
    screen_name: 'SeeBenProgram',
    count: 20
  };
  client.get('statuses/user_timeline', params, function (err, tweets, response) {
    if (!err) {
      for (let tweet of tweets) {
        console.log(`\nOn ${tweet.created_at}, ${tweet.user.screen_name} tweeted:\n'${tweet.text}'`);
        logData(`\nOn ${tweet.created_at}, ${tweet.user.screen_name} tweeted:\n'${tweet.text}'\n`);
      }
    } else {
      console.log(err);
    }
  });
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
        logData(`\n Artist name: ${track.artists[0].name}\n  Album name: ${track.album.name}\n   Song name: ${track.name}\nPreview link: ${track.preview_url || '(not available)'}\n`);
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
        logData(`\n Artist name: ${data.artists[0].name}\n  Album name: ${data.album.name}\n   Song name: ${data.name}\nPreview link: ${data.preview_url}\n`);
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
      logData(`\n              Movie Title: ${movie.Title}\n                     Year: ${movie.Year}\n              IMDB Rating: ${movie.Ratings[0].Value}\n   Rotten Tomatoes Rating: ${movie.Ratings[1].Value}\nCountry in which Produced: ${movie.Country}\n                 Language: ${movie.Language}\n                   Actors: ${movie.Actors}\n                     Plot: ${movie.Plot}\n`);
    } else {
      console.log(err);
    }
  });
}

/*  <random.txt file command> | $ node liri.js do-what-it-says
 *  Docs: https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_file_system
 *        https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_fs_readfile_path_options_callback
 *        https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback
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

function logData(data) {
  fs.appendFile('log.txt', data, 'utf8', err => {
    if (err) throw err;
  });
}
