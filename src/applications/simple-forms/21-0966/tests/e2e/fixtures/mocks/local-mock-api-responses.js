/* eslint-disable camelcase */
const mockFeatureToggles = require('./featureToggles.json');
const mockUser = require('./user.json');
const mockSipPut = require('./sip-put.json');
const mockSipGet = require('./sip-get.json');

const responses = {
  'GET /v0/feature_toggles': mockFeatureToggles,
  'GET /v0/user': mockUser,

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/in_progress_forms/21-0966': mockSipGet,
  'PUT /v0/in_progress_forms/21-0966': mockSipPut,
};

module.exports = responses;
