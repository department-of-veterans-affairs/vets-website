// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockUser = require('./user.json');
const features = require('./feature-flags');
const submit = require('./completed.json');

const completedForm = require('./completed-form.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features,
    },
  },
  'GET /v0/in_progress_forms/21P-8416': (req, res) => {
    return res.json({
      formData: completedForm,
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/review-and-submit',
      },
    });
  },
  'PUT /v0/in_progress_forms/21P-8416': (req, res) => {
    return res.json({
      data: {
        id: '1234',
        type: 'in_progress_forms',
        attributes: {
          formId: '21P-8416',
          createdAt: '2020-06-30T00:00:00.000Z',
          updatedAt: '2020-06-30T00:00:00.000Z',
          metadata: {
            version: 1,
            returnUrl: '/review-and-submit',
            savedAt: 1593500000000,
            lastUpdated: 1593500000000,
            expiresAt: 99999999999,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            inProgressFormId: 1234,
          },
        },
      },
    });
  },
  'POST /v0/claim_attachments': (req, res) => {
    return res.json({
      data: {
        attributes: {
          name: 'test-upload.pdf',
          size: 15306,
          confirmationCode: '5',
        },
      },
    });
  },
  'POST /medical_expense_reports/v0/form8416': submit,
};

module.exports = responses;
