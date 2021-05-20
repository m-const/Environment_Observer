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
			description:
				'Environment documentation and monitoring platform for developers.',
		},
		servers: [
			{
				url: process.env.APP_URL + ':' + process.env.PORT,
				description: 'Development Environment',
			},
		],
	},
	apis: ['./routes/api/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDocs));

module.exports = router;
