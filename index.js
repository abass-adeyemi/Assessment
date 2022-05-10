require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const displayRoutes = require('express-routemap');
const winston = require('winston');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mySqlConnection = require('./config/mysql');
const resultRoutes = require('./routes/result.routes');
const port = process.env.PORT;
const logger = require('./logger');

// parse application/json
app.use(bodyParser.json());

app.listen(port, async () => {
	console.log('i am listening on ', port);
	logger.info('i am listening on %s ', port);
	mySqlConnection.connect((err) => {
		if (err) throw err.stack;
		// connected!
		logger.info('successfully connected: %d ', mySqlConnection.threadId);
	});
	displayRoutes(app);
});
app.use(morgan('tiny'));

app.use('/api/v1/inec/results', resultRoutes);

app.get('/', (req, res) => {
	res.status(200).send({
		status: 'success',
		message: 'Welcome guys',
		data: [],
	});
});

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Bills Payment Server',
		version: '1.0.0',
		description: 'API Docs for cohorts',
		license: {
			name: 'zulfah-cohort1',
			url: '',
		},
		contact: {
			name: '',
			url: '',
		},
	},
	servers: [
		{
			url: `http://localhost:${port}/api/v1`,
			description: 'Development server',
		},
		{
			url: '',
			description: 'Production server',
		},
	],
};

const options = {
	swaggerDefinition,
	apis: [`./routes/*.js`],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
    Error 404
*/
app.use((req, res, next) => {
	logger.info('Seems you got lost. so sorry');
	res.status(404).send({
		status: 'error',
		message: 'Seems you got lost. so sorry',
	});
});
