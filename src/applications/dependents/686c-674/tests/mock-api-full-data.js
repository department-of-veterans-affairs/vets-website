/**
 * Run mock 686c-674 server with max data using
 * > yarn mock-api --responses ./src/applications/dependents/686c-674/tests/mock-api-full-data.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const mockUser = require('./e2e/user.json');
const mockVaFileNumber = require('./e2e/fixtures/va-file-number.json');
const mockMaxData = require('./e2e/fixtures/maximal.json');

const returnUrl = '/review-and-submit';

const submission = {
  formSubmissionId: '123fake-submission-id-567',
  timestamp: '2020-11-12',
  attributes: {
    guid: '123fake-submission-id-567',
  },
};

const mockSipGet = {
  formData: mockMaxData,
  metadata: {
    version: 0,
    prefill: true,
    returnUrl,
  },
};

const mockSipPut = {
  data: {
    id: '1234',
    type: 'in_progress_forms',
    attributes: {
      formId: '686C-674-V2',
      createdAt: '2021-06-03T00:00:00.000Z',
      updatedAt: '2021-06-03T00:00:00.000Z',
      metadata: {
        version: 1,
        returnUrl,
        savedAt: 1593500000000,
        lastUpdated: 1593500000000,
        expiresAt: 99999999999,
      },
    },
  },
};

/**
 * @returns mock user data with inProgressForms
 */
const userData = () => {
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = {
    form: '686C-674-V2',
    metadata: {
      version: 1,
      returnUrl,
      savedAt: new Date().getTime(),
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      createdAt: twoMonthsAgo,
      expiresAt: dateFns.getUnixTime(dateFns.add(new Date(), { years: 1 })),
      lastUpdated: twoMonthsAgo,
      inProgressFormId: 1234,
    },
    lastUpdated: twoMonthsAgo,
  };

  return {
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        inProgressForms: [sipData],
      },
    },
  };
};

const responses = {
  'GET /v0/user': userData(),
  'GET /v0/feature_toggles': {
    data: {
      features: [{ name: 'vaDependentsV2', value: true }],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/profile/valid_va_file_number': mockVaFileNumber,
  'GET /v0/in_progress_forms/686C-674-V2': mockSipGet,
  'PUT /v0/in_progress_forms/686C-674-V2': mockSipPut,

  'POST /v0/dependents_applications': submission,
};

module.exports = delay(responses, 200);
