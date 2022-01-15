const mongoose = require('mongoose');
const db = process.env.MONGO_URI;
const  logger  = require("./logger");
const sysLogger = new logger
const dbOptions = {
  useNewUrlParser: true,
  useFindAndModify:false,
  useUnifiedTopology: true,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_DB,
};

mongoose
  .connect(db, dbOptions)
  .then((x) => {
    sysLogger.info(
      `MongoDB connection established to DB: ${x.connections[0].name} on HOST: ${x.connections[0].host} PORT: ${x.connections[0].port}`
    );
  })
  .catch((err) => {
    sysLogger.fatal(err);
  });

module.exports = mongoose;
