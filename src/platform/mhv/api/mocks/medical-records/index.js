/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const status = require('./status');
const allergies = require('./allergies');
const vaccines = require('./vaccines');
const notes = require('./summaries-and-notes');

const responses = {
  'GET /my_health/v1/medical_records/session/status': status.status,
  'GET /my_health/v1/medical_records/allergies': allergies.allergies,
  'GET /my_health/v1/medical_records/vaccines': vaccines.vaccines,
  'GET /my_health/v1/medical_records/clinical_notes': notes.notes,
};

module.exports = delay(responses, 2000);
