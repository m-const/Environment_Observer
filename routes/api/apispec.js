require('dotenv').config();
const express = require('express');
const router = express.Router();

//Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: process.env.APP_NAME,
			version: process.env.APP_VERSION,
		},
	},
	apis: ['./routes/api/*.js', 'server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
/**
 * @openapi
 * /healthcheck/api-docs:
 *   get:
 *     description: Swagger UI - API spec
 *     tags:
 *       - Healthcheck
 *     responses:
 *       '200':
 *         description: Swagger UI
 */
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDocs));

module.exports = router;
