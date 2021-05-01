require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

//Connect to DB
const mongoose = require("mongoose");
const db = process.env.MONGOURI;

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/tool", require("./routes/tools/index"));
app.use("/healthcheck", require("./routes/healthcheck"));

//add the index page static route
app.use(express.static(path.join(__dirname, "svelte", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "index.html"));
});
//Start the server
const serverPort = process.env.PORT || 5000;
app.listen(serverPort, console.log(`Server Started on PORT: ${serverPort}`));
