require('dotenv').config();
// const resultModel = require('../models/result.model');
const { setEncoding } = require('../logger');
const Joi = require('Joi');
const logger = require('../logger');

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');
const {
	getPollingUnitResultByUniqueID,
	getPollingUnitResultByLgaID,
	enterPartyScore,
	getAllPollUnits,
	getAllLgas,
} = require('../models/result.model');
const { isEmpty, doSomeAsyncMagik } = require('../utils/utils');
// const { readFileAndSendEmail } = require('../services/email.services');
// const { hashMyPassword } = require('../controllers/users.controllers');
// const gertresult = async (req, res) => {

const getPollingUnitResult = async (req, res) => {
	const pollingUnit = req.body.pollingUnitID;
	console.log('pollingUnit', pollingUnit);
	const [err, getPollResultDetails] = await doSomeAsyncMagik(
		getPollingUnitResultByUniqueID(pollingUnit)
	);
	try {
		if (err) {
			throw new Error('Unable to complete action');
		}
		console.log(getPollResultDetails);

		res.status(200).send({
			status: true,
			message: 'polling unit result  details fetched',
			data: getPollResultDetails,
		});
	} catch (e) {
		res.status(400).send({
			status: false,
			message: 'Error',
		});
	}
};
const getAllPollUnit = async (req, res) => {
	try {
		const [err, allPollingUnit] = await doSomeAsyncMagik(getAllPollUnits());
		if (err) {
			logger.error('Error occured from get details:  %s', err);
			console.log('Error occured from details log:', err);
			throw new Error(err);
		}
		console.log('hey result', allPollingUnit);
		res.status(200).send({
			status: true,
			message: 'polling unit result  successfully entered',
			data: allPollingUnit,
		});
	} catch (error) {
		console.log('hey result', error);

		res.status(400).send({
			status: false,
			message: error.message || 'It has happened.',
		});
	}
};

const getAllLga = async (req, res) => {
	try {
		const [err, allPollingUnit] = await doSomeAsyncMagik(getAllLgas());
		if (err) {
			logger.error('Error occured from get details:  %s', err);
			console.log('Error occured from details log:', err);
			throw new Error(err);
		}
		console.log('hey result', allPollingUnit);
		res.status(200).send({
			status: true,
			message: 'polling unit result  successfully entered',
			data: allPollingUnit,
		});
	} catch (error) {
		console.log('hey result', error);

		res.status(400).send({
			status: false,
			message: error.message || 'It has happened.',
		});
	}
};
const getPollingUnitByLga_id = async (req, res) => {
	let pollUnitArray = [];
	const pollingUnits = req.body.lga_id;
	console.log('pollingUnit', pollingUnits);
	const [err, getPollUnits] = await doSomeAsyncMagik(
		getPollingUnitResultByLgaID(pollingUnits)
	);
	try {
		if (err) {
			throw new Error('Unable to complete action');
		}
		console.log('getPollUnits=>', getPollUnits);
		// pollUnitArray.push(getPollUnits[i].uniqueid);
		//
		let allPollingResults = [];
		for (let i = 0; i < getPollUnits.length; i++) {
			let currentId = getPollUnits[i].uniqueid;
			//call first api and pass poll Id as query
			let pollResult = await getPollingUnitResultByUniqueID(currentId);
			//get result and spread into bigger array
			allPollingResults = [...allPollingResults, ...pollResult];
			// console.log('allPollingResults=>', allPollingResults.length);
		}

		let parties = [
			'PDP',
			'DPP',
			'ACN',
			'PPA',
			'CDC',
			'JP',
			'ANPP',
			'LABOUR',
			'CPP',
		];
		let finalCollatedResult = [];

		parties.forEach((element) => {
			let sum = 0;
			allPollingResults.map((poll) => {
				if (poll.party_abbreviation == element) {
					sum += poll.party_score;
				}
			});

			finalCollatedResult.push({
				party_abbreviation: element,
				party_score: sum,
			});
		});

		res.status(200).send({
			status: true,
			message: 'polling unit result  details fetched',
			data: {
				finalCollatedResult,
				allPollingResults,
			},
		});
	} catch (e) {
		res.status(400).send({
			status: false,
			message: 'Error',
		});
	}
};
const enterPollingUnitScore = async (req, res) => {
	// announced_pu_results` (
	//   `result_id` int(11) NOT NULL AUTO_INCREMENT,
	//   `polling_unit_uniqueid` varchar(50) NOT NULL,
	//   `party_abbreviation` char(4) NOT NULL,
	//   `party_score` int(11) NOT NULL,
	//   `entered_by_user` varchar(50) NOT NULL,
	//   `date_entered` datetime NOT NULL,
	//   `user_ip_address` varchar(50) NOT NULL,
	//   PRIMARY KEY (`result_id`)

	const resultSchema = Joi.object({
		result_id: Joi.number(),
		polling_unit_uniqueid: Joi.string().required(),
		party_abbreviation: Joi.string().required(),
		party_score: Joi.number().required(),
		entered_by_user: Joi.string(),
		date_entered: Joi.string(),
		user_ip_address: Joi.string().required(),
	});

	const validateResult = resultSchema.validate(req.body);
	if (validateResult.error) {
		console.log(
			'Seems there was validation error %s',
			validateResult.error.details[0].message
		);
		logger.info(
			'Seems there was validation error %s',
			validateResult.error.details[0].message
		);

		//console.log(validateUser.error.details[0].message)
		res.status(422).send({
			status: false,
			message: validateResult.error.details[0].message,
		});
	}
	const {
		result_id,
		polling_unit_uniqueid,
		party_abbreviation,
		party_score,
		entered_by_user,
		user_ip_address,
	} = req.body;
	try {
		const [err, enterResult] = await doSomeAsyncMagik(
			enterPartyScore(
				result_id,
				polling_unit_uniqueid,
				party_abbreviation,
				party_score,
				entered_by_user,
				user_ip_address
			)
		);
		if (err) {
			logger.error('Error occured from insertion:  %s', err);
			console.log('Error occured from insertion:', err);
			throw new Error('Internal Server Error');
		}
		// console.log('hey result', enterResult);
		res.status(200).send({
			status: true,
			message: 'polling unit result  successfully entered',
			data: [],
		});
	} catch (error) {
		console.log('hey result', error);

		res.status(400).send({
			status: false,
			message: error.message || 'It has happened.',
		});
	}
};
module.exports = {
	getPollingUnitResult,
	getPollingUnitByLga_id,
	enterPollingUnitScore,
	getAllPollUnit,
};
