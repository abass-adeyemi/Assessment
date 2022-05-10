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

module.exports = {
	getPollingUnitResultByUniqueID,
	getPollingUnitResultByLgaID,
	enterPartyScore,
	getAllPollUnits,
	getAllLgas,
};
