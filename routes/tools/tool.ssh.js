require("dotenv").config();
const SSH = require("simple-ssh");

// parser to parse the data(separated by tabs and spaces)
//const parser = require('csv-parse');
//https://stackoverflow.com/questions/36210395/getting-results-of-execution-ssh-client-in-nodejs

function ssh(host, user, password, cmd, callback) {
  var ssh_options = new SSH({
    host: host,
    user: user,
    pass: password,
  });
  let output = {};
 ssh_options
    .exec(cmd, {
      out: function (stdout) {
        output.stdout = stdout;
      },
      err: function (stderr) {
        output.error = stderr;
      },
      exit: function (code) {
        output.code = code;

        return callback(output);
      },
    })
    .start();
}

module.exports = ssh;
