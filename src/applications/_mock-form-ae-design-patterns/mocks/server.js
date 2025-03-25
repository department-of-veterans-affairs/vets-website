const delay = require('mocker-api/lib/delay');

const address = require('./endpoints/address');
const emailAddress = require('./endpoints/email-addresses');
const telephone = require('./endpoints/telephones');

const { generateFeatureToggles } = require('./endpoints/feature-toggles');

const maintenanceWindows = require('./endpoints/maintenance-windows');

const {
  createSaveInProgressUpdate,
} = require('./endpoints/in-progress-forms/update');

const mockFormAeDesignPatterns = require('./endpoints/in-progress-forms/mock-form-ae-design-patterns');

const prefill261880 = require('./endpoints/in-progress-forms/26-1880');
const prefill221990 = require('./endpoints/in-progress-forms/22-1990');
const prefill10182 = require('./endpoints/in-progress-forms/10182');
// transaction status that is used for address, email, phone number update flows
const {
  getEmptyStatus,
  generateStatusResponse,
} = require('./endpoints/status');

const { generateCoeEmptyResponse } = require('./endpoints/coe/status');

// use one of these to provide a generic error response for any endpoint
const genericErrors = {
  error500: require('./errors/500.json'),
  error401: require('./errors/401.json'),
  error403: require('./errors/403.json'),
};

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

// utils
const { delaySingleResponse, boot } = require('./script/utils');
const { updateMemDb } = require('./script/mem-db');

const responses = {
  'GET /v0/feature_toggles': (_req, res) => {
    const secondsOfDelay = 0;
    delaySingleResponse(
      () =>
        res.json(
          generateFeatureToggles({
            aedpVADX: true,
            aedpPrefill: true,
            coeAccess: true,
            profileUseExperimental: true,
          }),
        ),
      secondsOfDelay,
    );
  },

  'GET /v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.json(mockFormAeDesignPatterns.prefill),
      secondsOfDelay,
    );
  },

  'GET /v0/in_progress_forms/26-1880': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => res.json(prefill261880), secondsOfDelay);
  },

  'GET /v0/in_progress_forms/22-1990': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => res.json(prefill221990), secondsOfDelay);
  },

  'GET /v0/in_progress_forms/10182': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => res.json(prefill10182), secondsOfDelay);
  },

  'PUT /v0/in_progress_forms/:id': (req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.json(createSaveInProgressUpdate(req)),
      secondsOfDelay,
    );
  },

  'GET /v0/coe/status': generateCoeEmptyResponse(),
  'GET /v0/user': (req, res) => {
    const shouldError = false; // set to true to test error response
    if (shouldError) {
      return res.status(500).json(genericErrors.error500);
    }
    return res.json(updateMemDb(req));
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': (_req, res) => {
    return res.json(maintenanceWindows.noDowntime);
  },
  'POST /v0/profile/address_validation': address.addressValidationMatch,
  'PUT /v0/profile/telephones': (req, res) => {
    return res.json(
      updateMemDb(req, telephone.homePhoneUpdateReceivedPrefillTaskPurple),
    );
  },
  'POST /v0/profile/telephones': (req, res) => {
    return res.json(
      updateMemDb(
        req,
        // telephone.homePhoneUpdateReceivedPrefillTaskPurple,
        telephone.mobilePhoneUpdateReceivedPrefillTaskBlue,
      ),
    );
  },
  'POST /v0/profile/email_addresses': (req, res) => {
    return res
      .status(200)
      .json(updateMemDb(req, emailAddress.transactions.received));
  },
  'PUT /v0/profile/email_addresses': (req, res) => {
    return res
      .status(200)
      .json(updateMemDb(req, emailAddress.transactions.received));
  },
  'PUT /v0/profile/addresses': (req, res) => {
    // uncomment to test 401 error
    // return res.status(401).json(require('../tests/fixtures/401.json'));
    // eslint-disable-next-line no-plusplus
    // callCount++;
    // if (callCount === 1) {
    //   return res.status(500).json(genericErrors.error500);
    // }
    const shouldError = true;
    if (shouldError) {
      return res.status(500).json(genericErrors.error500);
    }

    // default response
    return res.json(
      updateMemDb(req, address.mailingAddressUpdateReceivedPrefillTaskGreen),
    );
  },
  'POST /v0/profile/addresses': (req, res) => {
    return res.json(updateMemDb(req));
  },
  'DELETE /v0/profile/addresses': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.status(200).json(address.homeAddressDeleteReceived),
      secondsOfDelay,
    );
  },
  'GET /v0/profile/status': getEmptyStatus, // simulate no status / no transactions pending
  'GET /v0/profile/status/:id': (req, res) => {
    // this function allows some conditional logic to be added to the status endpoint
    // to simulate different responses based on the transactionId param
    return generateStatusResponse(req, res);
  },
};

// here we can run anything that needs to happen before the mock server starts up
// this runs every time a file is mocked
// but the single boot function will only run once
const generateMockResponses = () => {
  boot(mockLocalDSOT);

  // set DELAY=1000 when running mock server script
  // to add 1 sec delay to all responses
  const responseDelay = process?.env?.DELAY || 0;

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
