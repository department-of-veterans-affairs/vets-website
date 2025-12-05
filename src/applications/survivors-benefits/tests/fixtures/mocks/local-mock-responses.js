// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js
const mockItf = require('./mock-itf');
const mockUser = require('./user.json');
const features = require('./feature-flags');
const completedForm = require('./completed-form.json');

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features,
    },
  },
  'GET /v0/intent_to_file/pension': (req, res) => {
    return res.json({
      ...mockItf.getItf(),
    });
  },
  'POST /v0/intent_to_file/pension': (req, res) => {
    return res.json({
      ...mockItf.postItf(),
    });
  },
  'GET /v0/in_progress_forms/21P-534EZ': (req, res) => {
    return res.json({
      formData: completedForm,
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/review-and-submit',
      },
    });
  },
  'PUT /v0/in_progress_forms/21P-534EZ': (req, res) => {
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
  'POST /survivors_benefits/v0/form534ez': (req, res) => {
    return res.json({
      formSubmissionId: '123fake-submission-id-567',
      confirmationNumber: '123fake-submission-id-567',
      timestamp: '2020-11-12',
      attributes: {
        guid: '123fake-submission-id-567',
      },
    });
  },
};

module.exports = responses;
