require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     description: Healthcheck endpoint - returns applicaiton and component status.
*     tags: 
*       - Healthcheck
 *     responses:
 *       200:
 *         description: Returns JSON with application runtime information and status of dependant external sources.
 */
router.get("/", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Unavailable";
  const responseObject = {
    "Application PORT:": process.env.PORT,
    "Mongo DB Status:": mongoStatus,
  };
  res.status(200).json(responseObject).end();
  return;
});

//Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: process.env.APP_NAME,
      version: process.env.APP_VERSION,
    },
  },
  apis: ["./routes/api/*.js", "server.js"]
};
const swaggerUIOptions = {
  
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
router.use("/api-docs",swaggerUI.serve);
router.get("/api-docs", swaggerUI.setup(swaggerDocs, swaggerUIOptions));

module.exports = router;
