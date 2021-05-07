require('dotenv').config();
const express = require('express');
const router = express.Router();
require('mongoose');
const Host = require('../../models/hosts');
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

router.get('/list', (req, res) => {
	Host.find().then((hosts) => {
		res.status(200).json(hosts).end();
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

router.get('/:hostname', (req, res) => {
	Host.findOne({ hostname: req.params.hostname.toUpperCase() }).then((host) => {
		res.status(200).json(host).end();
		return;
	});
});

/**
 * @openapi
 * /add/host:
 *   post:
 *     description: Add a new host
 *     tags:
 *      - Hosts
 *     responses:
 *       '201':
 *         description: JSON added host object
 *     requestBody:
 *         description: ID number of the host to be queried
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/add', (req, res) => {
	//TODO: add validation and security middleware
	const addNewHost = new Host({
		hostname: req.body.hostname,
		url: req.body.url,
		description: req.body.description,
		status: {
			tool: req.body.tool,
			cmd: req.body.cmd,
			assert: req.body.assert,
		},
	});

	addNewHost.save().catch((err) => console.log(err));

	res.status(201).json(addNewHost).end();
	return;
});

/**
 * @openapi
 * /add/host/delete:
 *   delete:
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
 router.delete('/delete/:hostname', (req, res) => {
	Host.deleteOne({ hostname: req.params.hostname.toUpperCase() }).then((host) => {
		/* eslint-disable */
		//TODO: clean this up and add validation
		const code = (host.deletedCount === 1)? {status:200, msg: `Host Record Deleted for: ${req.params.hostname}`}:{status:400, msg: `No Records to delete`};
		/* eslint-enable */
		res.status(code.status).json(code).end();
		return;
	});
});

module.exports = router;
