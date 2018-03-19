// Dependency
const fs = require('fs');

// ParseCommand constructor
const ParseCommand = function() {};

// Returns 'command' & 'param' variables object from given 'fileName'
ParseCommand.prototype.parse = function(fileName) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    // Error handling
    if (err) throw err;
    // Parse file
    let dataArray = data.split(',');
    // Declare variables for data
    command = array[0];
    param = array[1];
    // Return object of command & param
    return { command, param };
  });
}

module.exports = ParseCommand;