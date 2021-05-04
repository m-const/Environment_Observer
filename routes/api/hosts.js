require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

router.get("/list", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Unavailable";
  const responseObject = {
    "Application PORT:": process.env.PORT,
    "Mongo DB Status:": mongoStatus,
  };
  res.status(200).json(responseObject).end();
  return;
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


 router.get("/:hostID", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Unavailable";
  const responseObject = {
    "Application PORT:": process.env.PORT,
    "Mongo DB Status:": req.params.hostID,
  };
  res.status(200).json(responseObject).end();
  return;
});

module.exports = router;
