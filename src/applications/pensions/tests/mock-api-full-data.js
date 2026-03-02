/**
 * Run mock Pensions server with max data using
 * > yarn mock-api --responses ./src/applications/pensions/tests/mock-api-full-data.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const mockUser = require('./fixtures/mocks/user.json');
const mockMaxData = require('./e2e/fixtures/data/maximal-test.json');

const returnUrl = '/applicant/information';

const submission = {
  data: {
    id: '8',
    type: 'saved_claim_pensions',
    attributes: {
      submittedAt: new Date().toISOString(),
      regionalOffice: [
        'Attention:  Philadelphia Pension Center',
        'P.O. Box 5206',
        'Janesville, WI 53547-5206',
      ],
      confirmationNumber: '01e77e8d-79bf-4991-a899-4e2defff11e0',
      guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
      form: '21P-527EZ',
    },
  },
};

const itf = {
  data: {
    id: '',
    type: 'intent_to_file',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2026-01-11T19:53:45.810+00:00',
          expirationDate: dateFns.formatISO(
            dateFns.add(new Date(), { months: 1 }),
          ),
          participantId: 1,
          source: '',
          status: 'active',
          type: 'pension',
        },
      ],
    },
  },
};

const mockSipGet = {
  formData: mockMaxData.data,
  metadata: {
    version: 0,
    prefill: false,
    returnUrl,
  },
};

const mockSipPut = {
  data: {
    id: '1234',
    type: 'in_progress_forms',
    attributes: {
      formId: '21P-527EZ',
      createdAt: '2021-06-03T00:00:00.000Z',
      updatedAt: '2021-06-03T00:00:00.000Z',
      metadata: {
        version: 1,
        returnUrl,
        savedAt: 1593500000000,
        lastUpdated: 1593500000000,
        expiresAt: 99999999999,
        inProgressFormId: 1234,
      },
    },
  },
};

/**
 * @returns {Object} mock user data with inProgressForms
 */
const userData = () => {
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = {
    form: '21P-527EZ',
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
      type: 'feature_toggles',
      features: [
        { name: 'pensionFormEnabled', value: true },
        { name: 'pension_form_enabled', value: true },
        { name: 'pensionRatingAlertLoggingEnabled', value: true },
        { name: 'pension_rating_alert_logging_enabled', value: true },
      ],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/21P-527EZ': mockSipGet,
  'PUT /v0/in_progress_forms/21P-527EZ': mockSipPut,
  'GET /v0/intent_to_file/pension': itf,
  'GET /v0/rated_disabilities': {
    data: {
      type: 'disability_ratings',
      attributes: { combinedDisabilityRating: 100 },
    },
  },

  'POST /pensions/v0/claims': submission,
};

module.exports = delay(responses, 200);
