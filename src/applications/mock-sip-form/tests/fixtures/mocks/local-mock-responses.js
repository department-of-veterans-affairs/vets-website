const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,

  'GET /v0/in_progress_forms/XX-123': {
    formData: { email: 'test@test.com' },
    metadata: {
      version: 0,
      returnUrl: '/first-page',
      savedAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      lastUpdated: Date.now(),
    },
  },

  // normal autosave success:
  'PUT /v0/in_progress_forms/XX-123': {
    data: {
      attributes: {
        metadata: {
          version: 0,
          returnUrl: '/first-page',
          savedAt: Date.now(),
          expiresAt: Date.now() + 86400000,
          lastUpdated: Date.now(),
          inProgressFormId: 12345,
        },
      },
    },
  },

  // error autosave:
  // 'PUT /v0/in_progress_forms/XX-123': (req, res) => res.status(500).json({}),

  'POST /v0/mock_sip_form': {
    formSubmissionId: '123fake-submission-id-567',
    timestamp: '2016-05-16',
  },
};
