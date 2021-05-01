require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/:tool", (req, res) => {
  const ssh = require("./tool.ssh");

  const toolRes = ssh(
    process.env.TEST_SSH_HOST,
    process.env.TEST_SSH_USER,
    process.env.TEST_SSH_PASS,
    "pwd",
    (output) => {
      console.log(output);
      if (output.status === false) {
        //There was an SSH error
        return res
          .send(
            `SSH Error: ${output.stderr} Requested Tool: ${req.params.tool} `
          )
          .status(200);
      }
      if (output.code !== 0 && output.status === true) {
        //There was an error with the command provided

        return res
          .send(
            `Exit code: ${output.code} - ${output.stderr} Requested Tool: ${req.params.tool} `
          )
          .status(200);
      } else {
        //provided command executed correctly

        return res
          .send(`${output.stdout} Requested Tool: ${req.params.tool} `)
          .status(200);
      }
    }
  );
});

module.exports = router;
