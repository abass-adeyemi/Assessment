const express = require('express');
const router = express.Router();
const resultController = require('../controllers/inecResult.controller');

router.get('/lgas', resultController.getAllPollUnit);
router.get('/polling_units', resultController.getAllPollUnit);
router.get('/get_PU_result', resultController.getPollingUnitResult);
router.get('/get_lga_result', resultController.getPollingUnitByLga_id);
router.post('/enter_pu_result', resultController.enterPollingUnitScore);
module.exports = router;
