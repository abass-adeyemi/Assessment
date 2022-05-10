'use strict';

const mysqlConnection = require('../config/mysql');

const getPollingUnitResultByUniqueID = async (polling_unit_uniqueid) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from announced_pu_results where polling_unit_uniqueid=?`,
				values: [polling_unit_uniqueid],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};
const getPollingUnitResultByLgaID = async (lga_id) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select uniqueid from polling_unit where lga_id=?`,
				values: [lga_id],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

// announced_pu_results` (
//   `result_id` int(11) NOT NULL AUTO_INCREMENT,
//   `polling_unit_uniqueid` varchar(50) NOT NULL,
//   `party_abbreviation` char(4) NOT NULL,
//   `party_score` int(11) NOT NULL,
//   `entered_by_user` varchar(50) NOT NULL,
//   `date_entered` datetime NOT NULL,
//   `user_ip_address` varchar(50) NOT NULL,
//   PRIMARY KEY (`result_id`)

const enterPartyScore = async (
	result_id,
	polling_unit_uniqueid,
	party_abbreviation,
	party_score,
	entered_by_user,
	user_ip_address
) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `Insert into announced_pu_results (result_id,polling_unit_uniqueid, party_abbreviation,party_score, entered_by_user, user_ip_address) values (?,?,?,?,?,?)`,
				values: [
					result_id,
					polling_unit_uniqueid,
					party_abbreviation,
					party_score,
					entered_by_user,
					user_ip_address,
				],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

const getAllPollUnits = async () => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from polling_unit`,
				// values: []
			},
			(err, results, fields) => {
				if (err) {
					console.log('err in model', err);
					reject(err);
				}
				resolve(results);
			}
		);
	});
};
const getAllLgas = async () => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from lga`,
				// values: []
			},
			(err, results, fields) => {
				if (err) {
					console.log('err in model', err);
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

const getOtp = (customer, otp) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from _otps where customer_id =? and otp=?`,
				values: [customer, otp],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

const newUser = async (
	email,
	firstname,
	surname,
	password,
	phone,
	customer_id
) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `Insert into customers(email, firstname, surname, password, phone, customer_id)values(?,?,?,?,?,?)`,
				values: [email, firstname, surname, password, phone, customer_id],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

const getUserDetails = async (customer_id) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from customers where email=?`,
				values: [email],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};

const checkUser = async (email, phone) => {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(
			{
				sql: `select * from customers where email=? or phone=?`,
				values: [email, phone],
			},
			(err, results, fields) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	});
};
module.exports = {
	checkUser,
	getOtp,
	getUserDetails,
	getPollingUnitResultByUniqueID,
	getPollingUnitResultByLgaID,
	enterPartyScore,
	getAllPollUnits,
	getAllLgas,
};
