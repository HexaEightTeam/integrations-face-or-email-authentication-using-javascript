// Importing required modules
const jwt = require('jsonwebtoken'); // Used for creating and verifying JSON Web Tokens
const TOKEN_SERVER_URL_PORT = process.env.TOKENSERVER_PORT; // Port where the token server is running
const TOKENSERVER_LOCATION = process.env.TOKENSERVER_LOCATION; // Location of the token issuer
const SECRETKEY = process.env.SECRETKEY; // Secret key for JWT, stored in environment variables
const axios = require('axios'); // Used for making HTTP requests
const crypto = require('crypto'); // Used for hashing and generating random bytes
const fs = require('fs'); // Used for file system operations

// Exporting a function that takes an Express application instance as an argument
module.exports = (app) => {

    // Route for logging in
    app.post('/api/login', async (req, res, next) => {
        const { sessioncode, accesscode } = req.body;

        // Double hash the session code
        const doublehashedSessionCode = doublehashSessionCode(sessioncode);

	try {
	        // Read the file
        	const fileContents = fs.readFileSync(`${TOKENSERVER_LOCATION}/localcache/${doublehashedSessionCode}`, 'utf8');

	        // Split the file contents
        	const splitContents = fileContents.split('|');

	        // Fetch the resource info
        	const response = await axios.get(`http://localhost:${TOKEN_SERVER_URL_PORT}/api/resourceinfo`);
	        const resourceInfo = response.data.toLowerCase();

	        // Form the string to be hashed	
	        const stringToHash = resourceInfo + splitContents[5].toLowerCase() + splitContents[0] + accesscode + splitContents[1];

        	// Hash the string
	        const hash = crypto.createHash('sha512');
	        hash.update(stringToHash);
	        const hashedString = hash.digest('hex');

	        // Check if the hashes match
        	if (hashedString.toUpperCase() === splitContents[2].toUpperCase()) {
	            const payload = {
        	        emailHash: splitContents[4],
	                nameHash: splitContents[2],
	                userType: splitContents[3]
        	    };
	            const randomKey = crypto.randomBytes(64).toString('hex');
        	    res.cookie('secretKey', randomKey, { httpOnly: true, sameSite: 'strict' });

	            jwt.sign(payload, SECRETKEY, { expiresIn: '24h' },(err, token) => {
        	        if(err) { console.log(err) }    
                		res.json({ token: token });
            		});
        	} else {
            		console.log('ERROR: Could not log in');
	            res.sendStatus(401);
        	}
	}
	catch {
       		console.log('ERROR: Could not log in');
                res.sendStatus(401);
	}

    });

    // This is a protected route 
    app.get('/api/data', checkToken, (req, res) => {
        // Verify the JWT token generated for the user
        jwt.verify(req.token, SECRETKEY, (err, authorizedData) => {
            if(err){
                // If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.status(403).json({ authorizedData: 'Login Failed... Could not connect to the protected route' });
            } else {
                // If token is successfully verified, we can send the authorized data 
                res.json({
                    authorizedData: "Successful log in!! This is a protected resource"
                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
    });

    // Route for logging out
    app.post('/api/logout', (req, res) => {
        res.clearCookie('secretKey');
        res.json({
            data: "Logout Successful"		
        });

        res.send('Logged out');
    });

    // Route for getting a face token
    app.post('/api/facetoken', async (req, res) => {
        const facialPicture = req.body.facialPicture;

        try {
            const response = await axios.post(`http://localhost:${TOKEN_SERVER_URL_PORT}/api/get-face-code`, facialPicture);

            if (response.data) {
                const sessionCode = generateSessionCode();
                const doublehashedSessionCode = doublehashSessionCode(sessionCode);
                const fileContent = 'P:::' + response.data;

                fs.writeFileSync(`${TOKENSERVER_LOCATION}/LOCALCACHE/${doublehashedSessionCode}`, fileContent);

                res.json({ sessionCode: sessionCode });
            } else {
                res.status(400).json({ error: 'Empty response from face code server' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error communicating with face code server' });
        }
    });

    // Route for getting an email session code
    app.post('/api/getemailsessioncode', async (req, res) => {
        const email = req.body.email;
        const hashemail = hashEmail(email);

        try {
            const sessionCode = generateSessionCode();
            const doublehashedSessionCode = doublehashSessionCode(sessionCode);
            const fileContent = 'H:::' + hashemail;

            fs.writeFileSync(`${TOKENSERVER_LOCATION}/LOCALCACHE/${doublehashedSessionCode}`, fileContent);

            res.json({ sessionCode: sessionCode });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching session code' });
        }
    });

}

// Function to hash an email
function hashEmail(email) {
    const hash = crypto.createHash('sha512');
    hash.update(email);
    const hashedEmail = hash.digest('hex');
    return hashedEmail;
}

// Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;

        next();
    } else {
        // If header is undefined return Forbidden (403)
        res.status(403).json({ authorizedData: 'No Access' });
    }
}

// Function to generate a session code
function generateSessionCode() {
    return crypto.randomBytes(2).toString('hex');
}

// Function to hash a session code
function hashSessionCode(sessionCode) {
    const hash = crypto.createHash('sha512');
    hash.update(sessionCode);
    return hash.digest('hex');
}

// Function to double hash a session code
function doublehashSessionCode(sessionCode) {
    const firstHash = crypto.createHash('sha512');
    firstHash.update(sessionCode);
    const intermediateHash = firstHash.digest('hex');

    const secondHash = crypto.createHash('sha512');
    secondHash.update(intermediateHash);
    return secondHash.digest('hex');
}