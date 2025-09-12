// mocks/responses.js
// const common = require('src/platform/testing/local-dev-mock-api/common');
const common = require('../../../platform/testing/local-dev-mock-api/common');

module.exports = {
  ...common,

  // Pretend the user is logged in (so forms prefill works in a realistic way)
  'GET /v0/user': {
    data: {
      type: 'users',
      attributes: {
        profile: {
          email: 'tester@example.com',
          firstName: 'Pat',
          middleName: 'Q',
          lastName: 'Veteran',
          loa: { current: 3 }, // high-assurance in mock
        },
        signIn: { serviceName: 'idme' },
      },
    },
  },

  // Prefill (your app will request prefill automatically on load)
  'GET /v0/in_progress_forms/21-526EZ-summary-demo': {
    data: {
      attributes: {
        formId: '21-526EZ-summary-demo',
        metadata: { version: 1, prefill: true, returnUrl: '/summary' },
        formData: {
          // nameAndDateOfBirth page
          fullName: { first: 'Pat', middle: 'Q', last: 'Veteran' },
          dateOfBirth: '1950-05-12',

          // contactInfo page
          phone: '202-333-6688',
          email: 'L.jackson.vet@email.com',
          country: 'USA',
          address: {
            street: '1700 Clairmont Rd',
            city: 'Decatur',
            state: 'GA',
            postalCode: '30033-4032',
          },

          // housing page
          homelessStatus: "I'm at risk of becoming homeless.",
          contactName: 'Bob',
          contactPhone: '123-123-1234',

          // terminally ill page
          terminallyIll: 'Yes',

          // service under another name page
          serviceFirstName: 'Leslie',
          serviceLastName: 'Jones',

          // claimed conditions page
          claimedConditions: [
            { name: 'Tinnitus', type: 'increased' },
            { name: 'Right knee strain', type: 'new' },
          ],
        },
        lastUpdated: Math.floor(Date.now() / 1000),
      },
    },
  },

  // Optional: if the form autosaves (we disabled SIP, but these are harmless)
  'PUT /v0/in_progress_forms/21-526EZ-summary-demo': {
    data: { attributes: { success: true } },
  },
  'POST /v0/in_progress_forms/21-526EZ-summary-demo': {
    data: { attributes: { success: true } },
  },

  // Submit endpoint for the demo
  'POST /v0/526-summary-demo/submit': (req, res) => {
    // Echo back the formData so our confirmation page can show the same summary
    res.json({
      data: { attributes: { confirmationNumber: 'ABC123-DEMO' } },
      formData: req.body || {},
    });
  },
};
