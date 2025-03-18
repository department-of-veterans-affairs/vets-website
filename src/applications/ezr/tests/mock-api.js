/**
 * Run mock appeals server using
 * > yarn mock-api --responses ./src/applications/ezr/tests/mock-api.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const delay = require('mocker-api/lib/delay');

const mockSipGet = require('./fixtures/mocks/prefill.json');
const mockSipPut = require('./fixtures/mocks/put-progress-forms.json');
const mockUser = require('./fixtures/mocks/user.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      features: [
        { name: 'loading', value: false },
        { name: 'ezrProdEnabled', value: true },
        { name: 'ezrFormPrefillWithProvidersAndDependents', value: true },
      ],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/10-10EZR': mockSipGet,
  'PUT /v0/in_progress_forms/10-10EZR': mockSipPut,
};

module.exports = delay(responses, 200);
