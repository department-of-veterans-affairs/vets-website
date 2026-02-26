// yarn mock-api --responses ./src/applications/{application}/tests/e2e/fixtures/mocks/local-mock-responses.js

const responses = {
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'form214140',
          value: true,
        },
        {
          name: 'form214140_validate_email_presence',
          value: false,
        },
        {
          name: 'form214140_validate_dob',
          value: false,
        },
        {
          name: 'form218940_leaving_last_position',
          value: false,
        },
      ],
    },
  },
};

module.exports = responses;
