require('dotenv').config();
const simpleSSH = require('simple-ssh');
//https://www.npmjs.com/package/simple-ssh

//Send an SSH command using simple SSH, respose is handled with a callback
function ssh(host, user, password, cmd, callback) {
  const ssh_options = new simpleSSH({
    host: host,
    user: user,
    pass: password,
    timeout: process.env.SSH_TIMEOUT,
  });
  //if the command starts with sudo enable pseudo-tty
  let cmdString = cmd.toLowerCase().split(' ');
  let isPseudoTTY = cmdString[0] === 'sudo';
  //create empty response object - this is used to gather output and returned
  let output = {};
  ssh_options
    .exec(cmd, {
      pty: isPseudoTTY,

      exit: function (code, stdout, stderr) {
        output.code = code;
        output.stderr = stderr;
        output.stdout = stdout;
        return callback(output);
      },
    })
    .start({
      fail: (err) => {
        output.status = false;
        output.stderr = err;
        return callback(output);
      },
    });
}

module.exports = ssh;
