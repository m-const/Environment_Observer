require("dotenv").config();
//https://www.npmjs.com/package/simple-ssh
const SSH = require("simple-ssh");

//Send an SSH command using simple SSH, respose is handled with a callback
function ssh(host, user, password, cmd, callback) {

  //if the command starts with sudo enable pseudo-tty
  let cmdString = cmd.toLowerCase().split(' ');
  let isPseudoTTY = (cmdString[0] === 'sudo');

  //define SSH connection parms
  var ssh_options = new SSH({
    host: host,
    user: user,
    pass: password,
  });

  //create empt response object - this is used to gather output and returned
  let output = {};

 ssh_options
    .exec(cmd, {
      pty: isPseudoTTY,
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
