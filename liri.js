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
const param = process.argv[3];

// For debugging
console.log(`Command is: ${command}`);
console.log(`Param is: ${param}`);

/*  npm packages:
 *    https://www.npmjs.com/package/twitter
 *    https://www.npmjs.com/package/node-spotify-api
 *    https://www.npmjs.com/package/request
 *    https://www.npmjs.com/package/dotenv
 */
