require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');

//Connect to DB
require('./utils/mongo');

//Middleware
app.use(fileUpload());

//Auth
//TODO: set up auth
/* passport.use(new OAuth2Strategy({
  authorizationURL: 'https://www.example.com/oauth2/authorize',
  tokenURL: 'https://www.example.com/oauth2/token',
  clientID: EXAMPLE_CLIENT_ID,
  clientSecret: EXAMPLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/example/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
)); */

//Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tool', require('./routes/tools/index'));
app.use('/api/host', require('./routes/api/hosts'));
app.use('/api/fields', require('./routes/api/fields'));
app.use('/healthcheck', require('./routes/api/healthcheck'));
app.use('/api-spec', require('./routes/api/apispec'));

//add the index page static route
app.use(express.static(path.join(__dirname, 'svelte', 'public')));
/* app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname, 'svelte', 'public', 'index.html'));
}); */

//Start the server
const serverPort = process.env.PORT || 5000;

const serverOptions = {
	key: fs.readFileSync(path.join(__dirname, 'bin', process.env.CERTIFICATE_KEY), 'utf8'),
	cert: fs.readFileSync(path.join(__dirname, 'bin', process.env.CERTIFICATE), 'utf8'),
  passphrase: process.env.CERTIFICATE_PASSPHRASE
};
https
	.createServer(serverOptions, app)
	.listen(serverPort, console.log(`Server Started on PORT: ${serverPort}`));
