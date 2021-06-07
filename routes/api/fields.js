require('dotenv').config();
const express = require('express');
const router = express.Router();
require('mongoose');
const Host = require('../../models/hosts');
const { ensureAuthenticated } = require('../../utils/auth');
const cryptoUtils = require('../../utils/encrypt');


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

 router.get('/decrypt/:fieldID', ensureAuthenticated, (req, res) => {
	Host.findOne({ 'fields._id': req.params.fieldID}).then((host) => {
        const queryResult = host.fields.id(req.params.fieldID)
        const decyptedValue = cryptoUtils.decrypt(
            Buffer.from(queryResult.value, 'base64'),
            Buffer.from(queryResult.encryptionKey, 'base64')
        ).toString('utf8')

        const returnObject = {
            key: queryResult.key,
            Value: decyptedValue
        }

		res.status(200).json(returnObject).end();
		return;
	});
});
module.exports = router;
