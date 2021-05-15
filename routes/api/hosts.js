require('dotenv').config();
const express = require('express');
const router = express.Router();
require('mongoose');
const Host = require('../../models/hosts');
const { ensureAuthenticated } = require('../../utils/auth');


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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hosts'
*/

 

router.post('/add', (req, res) => {
	//TODO: add validation
	//TODO: add security middleware

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
		fieldsArr[i] = {
			key: req.body.fields[i].key,
			value: req.body.fields[i].value,
		};
	}

	const hostObject = {
		hostname: req.body.hostname,
		url: req.body.url,
		description: req.body.description,
		tools: toolsArr,
		fields: fieldsArr
	};

	const addNewHost = new Host(hostObject);

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
router.delete('/delete/:hostname', ensureAuthenticated, (req, res) => {
	Host.deleteOne({ hostname: req.params.hostname.toUpperCase() }).then(
		(host) => {
			/* eslint-disable */
			//TODO: clean this up and add validation
			const code =
				host.deletedCount === 1
					? {
							status: 200,
							msg: `Host Record Deleted for: ${req.params.hostname}`,
					  }
					: { status: 400, msg: `No Records to delete` };
			/* eslint-enable */

			res.status(code.status).json(code).end();
			return;
		}
	);
});

module.exports = router;
