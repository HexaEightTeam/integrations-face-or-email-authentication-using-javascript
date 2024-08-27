# Integration - JavaScript Authentication using HexaEight Token Server
#### Vanilla Javascript Implementation With Face Authentication and EMail Authentication

This repository contains a JavaScript implementation of authentication using HexaEight Token Server. The code implements JWT 

```
Optional : HTTPS secure cookies can be enabled for session management.
```

## Files
- login.html - Implements Face Authentication
- loginviaemail.html - Implements Email Authentication
- postlogin.html and postlogin2.html - Redirects to a protected resource after successful authentication
- main.js and main2.js - Main JavaScript files for the front-end
- server.js - Main server file
- userRoutes.js - Contains user-related routes

## Requirements
For this code to work, you need to activate HexaEight Token Server with a License on this same machine (localhost). 
Users need to install HexaEight Authenticator Mobile App and Register/create an Email Login Token and use a Captcha token to obtain their access code.

### Mobile Usage
If you are implementign this authentication on mobiles that do not support cookies, you need to keep track of invalidating JWT upon user logout.

### Installation

1. Clone the repository
2. Install the dependencies using npm install
3. Set the environment variable SECRET for your JWT
4. Set the environment variable TOKENSERVER_PORT to point to the HexaEight Token Server 
5. Set the environment variable TOKENSERVER_LOCATION to point to the directory where HexaEight Token Server is currently runnning. 
6. Start the server using npx nodemon server\server.js
7. Open login.html or loginviaemail.html in your browser to start the authentication process
8. Use HexaEight Authenticator to obtain your access code to login to the application.


### Benefits:

- Bypass the need for user registration and email verification procedures.
- Eliminate the necessity to store user data and passwords, and validate any email. 
- Utilize the built-in authorization feature to accept emails from any domain. 
- Benefit from unlimited user authentication (with HexaEight Token Server licensed per CPU), leading to cost savings. 
- Avoid the need for third-party CORS implementation during authentication and have the flexibility to customize the code according to your requirements.


![Face Authentication](https://github.com/HexaEightTeam/integrations-javascript//blob/main/face-authentication.png?raw=true)

![EMail Authentication](https://github.com/HexaEightTeam/integrations-javascript//blob/main/email-authentication.png?raw=true)


