/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const status = require('./status');
const allergies = require('./allergies');

const responses = {
  'GET /my_health/v1/medical_records/session/status': status,
  'GET /my_health/v1/medical_records/allergies': allergies.allergies,
};

module.exports = delay(responses, 3000);
