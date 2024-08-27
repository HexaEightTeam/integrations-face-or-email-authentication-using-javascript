// Importing required modules
const fs = require('fs'); // File System module to interact with the file system
const path = require('path'); // Path module to work with file and directory paths

// Exporting a function that takes an Express application instance as an argument
// Reading the directory 'server/routes/api/' synchronously

module.exports = (app) => {
	fs.readdirSync('server/routes/api/').forEach((file) => {
		require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
	})
}