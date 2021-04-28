require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path")



//add the index page static route
app.use(express.static(path.join(__dirname,"svelte","public")));
app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname,"svelte","public","index.html"))
})
//Start the server
const serverPort = process.env.PORT || 5000
app.listen(serverPort,console.log(`Server Started on PORT: ${serverPort}`))
