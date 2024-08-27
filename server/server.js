// Import required modules
const express = require('express'); // Express.js for server and routing
const axios = require('axios'); // Axios for making HTTP requests
const crypto = require('crypto'); // Crypto for encryption
const fs = require('fs'); // File system for file operations
const helmet = require('helmet'); // Helmet for secure HTTP headers
//const https = require('https'); //Enable and configure https settings

// Create an Express application
const app = express();
// Define the port on which the server will run
const port = 3000;

// Use Helmet middleware for setting secure HTTP headers
app.use(helmet());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients), limit the body to 5mb
app.use(express.json({ limit: '5mb' }));
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Serve static files from the 'node_modules/face-api.js/dist' directory
app.use('/face-api', express.static('node_modules/face-api.js/dist'));

// Import and use the routes
require('./routes')(app);

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//const options = {
//    cert: fs.readFileSync('path_to_cert.pem'),
//    key: fs.readFileSync('path_to_cert.key'),
//};

//https.createServer(options, app).listen(port, () => {
//    console.log(`Server is running on port ${port}`);
//});