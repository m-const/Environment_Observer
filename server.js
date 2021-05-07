require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
//Connect to DB
require('./utils/mongo');






app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Protected ROUTES
//TODO: add AUTH
app.use('/tool', require('./routes/tools/index'));

//Unprotected routes
app.use('/api/host', require('./routes/api/hosts'));
app.use('/healthcheck', require('./routes/api/healthcheck'));
app.use('/api-spec', require('./routes/api/apispec'));
//add the index page static route
app.use(express.static(path.join(__dirname, 'svelte', 'public')));
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'svelte', 'public', 'index.html'));
}); */
//Start the server
const serverPort = process.env.PORT || 5000;
app.listen(serverPort, console.log(`Server Started on PORT: ${serverPort}`));
