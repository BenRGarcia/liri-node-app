// DataLogger constructor
var DataLogger = function() {};

// Logs data to console and .txt file
DataLogger.prototype.log = function(dataObj) {
  // Iterate over objects in dataObj
  for (let objKey in dataObj) {
    // Iterate over properties of each object
    for (let dataKey in objKey) {
      // Parse data to be logged
      let dataToLog = `\n${dataKey}:\n\t${objKey[dataKey]}`;
      // Log data to console
      console.log(dataToLog);
      // Log data to .txt file
      fs.appendFile('log.txt', dataToLog, 'utf8', err => {
        if (err) throw err;
      });
    }
  }
  return dataObj;
};

module.exports = DataLogger;