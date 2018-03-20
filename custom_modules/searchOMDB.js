// Require packages
const request = require('request');

// SearchOMDB Constructor
const SearchOMDB = function() {};

// Returns object of OMDB movie title object
SearchOMDB.prototype.search = function(movieName) {

  // Declare fallback movie name
  let name = movieName || 'Mr. Nobody';

  // Sanitize query for api call
  let queryName = name.replace(/\s/g, '+');

  // Assemble url to query
  let queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + queryName;

  // Return Promise to caller
  return new Promise((resolve, reject) => {

    // Make API call
    request(queryURL, (err, response, body) => {

      // Error handling
      if (err) reject(err);

      // Parse JSON object
      let movie = JSON.parse(body);

      // Create empty object to store movie details
      let results = {};

      // Add property to results object, movie name as key
      results[movie.Title] = {
        "Movie Title": movie.Title,
        "Year": movie.Year,
        "IMDB Rating": movie.Ratings[0].Value,
        "Rotten Tomatoes Rating": movie.Ratings[1].Value,
        "Country": movie.Country,
        "Language": movie.Language,
        "Actors": movie.Actors,
        "Plot": movie.Plot
      };

      // Resolve Promise
      resolve(results);
    });
  });
};

module.exports = SearchOMDB;
