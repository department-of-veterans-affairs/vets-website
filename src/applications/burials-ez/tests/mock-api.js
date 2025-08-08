/**
 * Run mock 21P-530EZ server with max data using
 * > yarn mock-api --responses ./src/applications/burials-ez/tests/mock-api.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');
const mockUser = require('./fixtures/mocks/user.json');

// Mock data to use
const mockMaxData = require('./schema/maximal-at-home-test.json');
// First page of the form
const returnUrl = '/claimant-information/relationship-to-veteran';

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
      formId: '21P-530EZ',
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
  const lastUpdated = new Date().getTime();
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = {
    form: '21P-530EZ',
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
    lastUpdated,
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
      features: [{ name: 'burialFormEnabled', value: true }],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/21P-530EZ': mockSipGet,
  'PUT /v0/in_progress_forms/21P-530EZ': mockSipPut,

  'POST /v0/claim_attachments': {
    data: {
      attributes: {
        guid: '123fake-submission-id-567',
        name: 'test-file.pdf',
        confirmationCode: '1234567890',
        attachmentId: '1234567890',
        size: 123456,
        type: 'application/pdf',
      },
      id: '11',
      type: 'upload',
    },
  },

  'POST burials/v0/claims': submission,
};

module.exports = delay(responses, 200);
