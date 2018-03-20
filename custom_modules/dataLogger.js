// Dependency
const fs = require('fs');

// DataLogger constructor
var DataLogger = function() {};

// Logs data to console and .txt file
DataLogger.prototype.log = function(dataObj) {
  // Return a Promise to caller (in case of future need for '.then()')
  return new Promise((resolve, reject) => {
    // Create empty string to concatenate data that needs to be logged
    let dataToLog = "";
    // Iterate over objects in dataObj
    for (let objKey in dataObj) {
      // Iterate over properties of each object
      for (let dataKey in dataObj[objKey]) {
        // Parse data to be logged
        dataToLog += `${dataKey}: ${dataObj[objKey][dataKey]}\n`;
      }
      // Append newline after each inner for loop run
      dataToLog += "\n";
    }
    // Log data to console
    console.log(dataToLog);
    // Log data to file
    fs.appendFile('log.txt', dataToLog, 'utf8', err => {
      if (err) reject(err);
      resolve(dataToLog);
    });
  });
};

module.exports = DataLogger;