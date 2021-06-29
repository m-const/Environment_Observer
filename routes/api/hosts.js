require("dotenv").config();
const express = require("express");
const Hosts = require("../../models/hosts");
const router = express.Router();
require("mongoose");
const Host = require("../../models/hosts");
const { ensureAuthenticated } = require("../../utils/auth");
const cryptoUtils = require("../../utils/encrypt");
const hostUtils = require("../../utils/hostUtils");
/**
 * @openapi
 * components:
 *  schemas:
 *    Hosts:
 *      type: object
 *      properties:
 *        hostname:
 *          type: string
 *        url:
 *          type: string
 *        description:
 *          type: string
 *        tools:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *              tool:
 *                type: string
 *              cmd:
 *                type: string
 *                example: sudo lsof -i -P -n |grep jenkins-agent
 *              assert:
 *                type: string
 *                example: /^(sshd).*(\(ESTABLISHED\))$/g
 *        fields:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              key:
 *                type: string
 *              value:
 *                type: string
 *              encrypted:
 *                type: boolean
 */
/**
 * @openapi
 * /api/host/list:
 *   get:
 *     description: List of observed hosts.
 *     tags:
 *       - Hosts
 *     responses:
 *       200:
 *         description: Returns JSON of each observed HOST
 */
//TODO: filter returned host fields to not return encrypted info / key, jsut return Key name.
router.get("/list", (req, res) => {
  Host.find().then((hosts) => {
    res.status(200).json(hostUtils.sanitize(hosts)).end();
    return;
  });
});

/**
 * @openapi
 * /api/host/{hostID}:
 *   get:
 *     description: Detailed environment information of the specified hostID.
 *     tags:
 *       - Hosts
 *     responses:
 *       '200':
 *         description: Returns JSON of each observed HOST
 *     parameters:
 *       - name: hostID
 *         in: path
 *         description: ID number of the host to be queried
 *         required: true
 *         schema:
 *           type: string
 */

router.get("/:hostname", (req, res) => {
  Host.findOne({ hostname: req.params.hostname.toUpperCase() }).then(
    (hosts) => {
      res.status(200).json(hostUtils.sanitize(hosts)).end();
      return;
    }
  );
});

//TODO: update schema for json body or yaml file host add
/**
 * @openapi
 * /add/host:
 *   post:
 *     description: Add a new host
 *     summary: Adds a new host to via yaml file or embedded json
 *     parameters:
 *       - in: header
 *         name: Input-Method
 *         description: embedded or file
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *      - Hosts
 *     responses:
 *       '201':
 *         description: JSON added host object
 *     requestBody:
 *         description: ID number of the host to be queried
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hosts'
 */

router.post("/add", ensureAuthenticated, (req, res) => {
  //TODO: add validation
  //TODO: add security middleware
  let inputMethodHeader = req.header("input-method");
  if (typeof inputMethodHeader === "undefined") {
    res.status(400).json({ error: "Invalid input method." }).end();
    return;
  }
  inputMethodHeader.toLowerCase();
  if (inputMethodHeader === "embedded") {
    //add all tools:
    let toolsArr = [];
    for (let i = 0; i < req.body.tools.length; i++) {
      toolsArr[i] = {
        description: req.body.tools[i].description,
        tool: req.body.tools[i].tool,
        cmd: req.body.tools[i].cmd,
        assert: req.body.tools[i].assert,
      };
    }

    //add all fields:
    let fieldsArr = [];
    for (let i = 0; i < req.body.fields.length; i++) {
      let fieldValuePlaintext = req.body.fields[i].value;
      if (req.body.fields[i].encrypted === true) {
        let key = cryptoUtils.getRandomKey();
        fieldValuePlaintext = cryptoUtils
          .encrypt(req.body.fields[i].value, key)
          .toString("base64");

        fieldsArr[i] = {
          key: req.body.fields[i].key,
          value: fieldValuePlaintext,
          encrypted: req.body.fields[i].encrypted,
          encryptionKey: key.toString("base64"),
        };
      } else {
        fieldsArr[i] = {
          key: req.body.fields[i].key,
          value: fieldValuePlaintext,
        };
      }
    }

    const hostObject = {
      hostname: req.body.hostname,
      url: req.body.url,
      description: req.body.description,
      tools: toolsArr,
      fields: fieldsArr,
    };
    const addNewHost = new Host(hostObject);
    addNewHost.save().catch((err) => console.log(err));
    res.status(201).json(addNewHost).end();
    return;
  } else if (inputMethodHeader === "file") {
    const yaml = require("js-yaml");
    const fs = require("fs");

    let fileError = undefined;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ Error: "No File Uploaded" }).end();
    }
    let inputFile = req.files.input;
    let uploadPath = "./tmp/" + inputFile.name;
    //only allow single file upload
    if (inputFile.length > 1 || typeof inputFile.length === undefined) {
      return res.status(400).json({ Error: "Too many files." }).end();
    }

    //ensure file is yaml
    if (
      inputFile.mimetype !== "text/yaml" &&
      inputFile.mimetype !== "application/json"
    ) {
      return res.status(400).json({ Error: "Invalid file type." }).end();
    }
    // Use the mv() method to place the file in tmp/
    inputFile.mv(uploadPath, function (err) {
      if (err) {
        fileError = err;
      } else {
        // Get document, or throw exception on error
        try {
          const doc = yaml.load(fs.readFileSync(uploadPath));
          const addNewHosts = [];
          //loop through hosts
          for (let x = 0; x < doc.hosts.length; x++) {
            let currentHost = doc.hosts[x];
            //add all tools:
            let toolsArr = [];
            for (let i = 0; i < currentHost.tools.length; i++) {
              toolsArr[i] = {
                description: currentHost.tools[i].description,
                tool: currentHost.tools[i].tool,
                cmd: currentHost.tools[i].cmd,
                assert: currentHost.tools[i].assert,
              };
            }

            //add all fields:
            let fieldsArr = [];
            for (let i = 0; i < currentHost.fields.length; i++) {
              let fieldValuePlaintext = currentHost.fields[i].value;
              if (currentHost.fields[i].encrypted === true) {
                let key = cryptoUtils.getRandomKey();
                fieldValuePlaintext = cryptoUtils.encrypt(
                  currentHost.fields[i].value,
                  key
                );

                fieldsArr[i] = {
                  key: currentHost.fields[i].key,
                  value: fieldValuePlaintext.toString("base64"),
                  encrypted: currentHost.fields[i].encrypted,
                  encryptionKey: key.toString("base64"),
                };
              } else {
                fieldsArr[i] = {
                  key: currentHost.fields[i].key,
                  value: fieldValuePlaintext,
                };
              }
            }

            const hostObject = {
              hostname: currentHost.hostname,
              url: currentHost.url,
              description: currentHost.description,
              tools: toolsArr,
              fields: fieldsArr,
            };
            addNewHosts[x] = new Host(hostObject);

            currentHost = undefined;
          }

          //delete file when finished with it
          fs.unlink(uploadPath, (err) => {
            if (err) {
              //log this error,
              console.error(err);
            }
          });

          //save to DB
          Host.create(addNewHosts).then(
            (val) => {
              res.status(201).json({ "Input-Method": "file", data: val }).end();
            },
            (err) => {
              res
                .status(500)
                .json({ "Input-Method": "file", error: err })
                .end();
            }
          );

          return;
        } catch (err) {
          fileError = err;
          console.log(err);
        }
      }
      res.status(500).json({ Error: fileError }).end();
    });

    //res.status(201).json({ 'Input-Method': 'file' }).end();
  } else {
    res.status(400).json({ error: "Invalid input method." }).end();
    return;
  }
});

/**
 * @openapi
 * /delete:
 *   delete:
 *     description: Delete a host
 *     tags:
 *      - Hosts
 *     responses:
 *       '200':
 *         description: JSON added host object
 *       '400':
 *         description: Returned when there is no matching record to delete
 */
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  Host.deleteOne({ _id: req.params.id }).then((host) => {
    /* eslint-disable */
    //TODO: clean this up and add validation
    const code =
      host.deletedCount === 1
        ? {
            status: 200,
            msg: `Host Record Deleted for: ${req.params.id}`,
          }
        : { status: 400, msg: `No Records to delete` };
    /* eslint-enable */

    res.status(code.status).json(code).end();
    return;
  });
});

/**
 * @openapi
 * /update/host:
 *   update:
 *     description: Delete a host
 *     tags:
 *      - Hosts
 *     responses:
 *       '200':
 *         description: JSON added host object
 *     requestBody:
 *         description: ID number of the host to be queried
 *         required: true
 *         schema:
 *           type: string
 */
router.patch("/update/:id/:type?/:subid?", ensureAuthenticated, (req, res) => {
  //this method is used to update a specific attribute of the host
  //URL param is the ID of the host to patch
  //request body to provide the update(s) in key value formatted json
  //this method should be used directly to update field and tool records
  let update = {};
  let filter = {};
  if (
    req.params.subid &&
    ["fields", "tools"].includes(req.params.type.toLowerCase())
  ) {
    const type = req.params.type.toLowerCase();
    for (const key in req.body) {
      update[type + ".$." + key] = req.body[key];
    }

    filter["_id"] = req.params.id;
    filter[type+"._id"] = req.params.subid;
  } else {
    filter = { _id: req.params.id };
    for (const key in req.body) {
      update[key] = req.body[key];
    }
  }
  const dbRes = Host.findOneAndUpdate(filter, update, {
    new: true,
  }).then((data) => {
    
    if (data) {
      res.status(200).json(data).end();
    } else {
      res.status(401).json(data).end();
    }
  },
  (err)=>{
    console.log(err)
  });
});

module.exports = router;
