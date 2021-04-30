require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/:tool", (req, res) => {
  const ssh = require("./tool.ssh");

  const toolRes = ssh(
    "192.168.0.126",
    "constm4",
    "constm4",
    "docker ls",
    (output) => {
      console.log(output);
      if (output.code != 0) {
        res
        .send(`Exit code: ${output.code} - ${output.error} Requested Tool: ${req.params.tool} `)
        .status(200);
      } else {
        res
          .send(`${output.stdout} Requested Tool: ${req.params.tool} `)
          .status(200);
      }
    }
  );
});

module.exports = router;
