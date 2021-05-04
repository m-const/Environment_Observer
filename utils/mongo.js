const mongoose = require("mongoose");
const db = process.env.MONGO_URI;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_DB,
};

mongoose
  .connect(db, dbOptions)
  .then((x) => {
    console.log(`MongoDB Connection established to DB: ${x.connections[0].name} on HOST: ${x.connections[0].host} PORT: ${x.connections[0].port}`);
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = mongoose;