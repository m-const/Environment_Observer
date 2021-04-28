require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path")
//Start the server
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"svelte","public","index.html"))
})

const serverPort = process.env.PORT || 5000
app.listen(serverPort,console.log(`Server Started on PORT: ${serverPort}`))
