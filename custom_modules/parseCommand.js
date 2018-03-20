// Require packages
const fs = require('fs');

// ParseCommand constructor
const ParseCommand = function() {};

// Returns 'command' & 'param' variables object from given 'fileName'
ParseCommand.prototype.parse = function(fileName) {
  
  // Return Promise to caller
  return new Promise((resolve, reject) => {
    
    // Read contents of file
    fs.readFile(fileName, 'utf8', (err, data) => {
      
      // Error handling
      if (err) reject(err);
      
      // Parse file
      let dataArray = data.split(',');
      
      // Declare variables for data
      command = dataArray[0];
      param = dataArray[1] || false;
      
      // Return object of command & param
      resolve({ command, param });
    });
  });
}

module.exports = ParseCommand;
