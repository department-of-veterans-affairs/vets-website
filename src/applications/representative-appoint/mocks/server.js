const _ = require('lodash');
const delay = require('mocker-api/lib/delay');

// endpoint data or generator functions
const user = require('./endpoints/poa');
const { generateFeatureToggles } = require('./endpoints/feature-toggles');
const maintenanceWindows = require('./endpoints/maintenance-windows');
const address = require('./endpoints/address');
const emailAddress = require('./endpoints/email-addresses');
const phoneNumber = require('./endpoints/phone-number');
const {
  handlePutGenderIdentitiesRoute,
  handleGetPersonalInformationRoute,
  handlePutPreferredNameRoute,
} = require('./endpoints/personal-information');
const serviceHistory = require('./endpoints/service-history');
const fullName = require('./endpoints/full-name');
const {
  getEmptyStatus,
  generateStatusResponse,
} = require('./endpoints/status');
const {
  maximalSetOfPreferences,
  generateSuccess,
} = require('./endpoints/communication-preferences');
const contacts = require('../tests/fixtures/contacts.json');

const handleUserUpdate = require('./endpoints/user/handleUserUpdate');
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

const error500 = require('../tests/fixtures/errors/500.json');

// utils
const { debug, delaySingleResponse } = require('./script/utils');

// use one of these to provide a generic error for any endpoint
const genericErrors = {
  error500,
};

const requestHistory = [];

const logRequest = req => {
  const { body, url, method, params, query } = req;
  const historyEntry = {};
  // only add variables to requestHistory if they are not empty
  if (!_.isEmpty(params)) {
    historyEntry.params = params;
  }
  if (!_.isEmpty(query)) {
    historyEntry.query = query;
  }

  if (!_.isEmpty(body)) {
    try {
      historyEntry.body = JSON.parse(body);
    } catch (e) {
      historyEntry.body = body;
    }
  }

  historyEntry.method = method;
  historyEntry.url = url;

  debug(JSON.stringify(historyEntry, null, 2));

  requestHistory.push({ ...historyEntry, url, method });
};

const responses = {
  'GET /v0/feature_toggles': (_req, res) => {
    const secondsOfDelay = 0;
    delaySingleResponse(
      () =>
        res.json(
          generateFeatureToggles({
            authExpVbaDowntimeMessage: false,
            profileHideDirectDeposit: false,
            profileShowCredentialRetirementMessaging: true,
            profileShowEmailNotificationSettings: true,
            profileShowMhvNotificationSettings: true,
            profileShowPaymentsNotificationSetting: true,
            profileShowProofOfVeteranStatus: true,
            profileShowQuickSubmitNotificationSetting: true,
            profileUseExperimental: true,
            profileShowDirectDepositSingleForm: true,
            profileShowDirectDepositSingleFormUAT: false,
            profileShowDirectDepositSingleFormAlert: true,
            profileShowDirectDepositSingleFormEduDowntime: true,
          }),
        ),
      secondsOfDelay,
    );
  },
  'GET /v0/user': (_req, res) => {
    const [shouldReturnUser, updatedUserResponse] = handleUserUpdate(
      requestHistory,
    );
    if (shouldReturnUser) {
      return res.json(updatedUserResponse);
    }
    return res.json(user.loa3User72); // default user LOA3 w/id.me (success)
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': (_req, res) => {
    return res.json(maintenanceWindows.noDowntime);

    // downtime for VA Profile aka Vet360 (according to service name in response)
    // return res.json(
    //   maintenanceWindows.createDowntimeActiveNotification([
    //     maintenanceWindows.SERVICES.VA_PROFILE,
    //   ]),
    // );
  },

  'POST /v0/profile/address_validation': address.addressValidation,
  'GET /v0/profile/personal_information': handleGetPersonalInformationRoute,
  'PUT /v0/profile/preferred_names': handlePutPreferredNameRoute,
  'PUT /v0/profile/gender_identities': handlePutGenderIdentitiesRoute,
  'GET /v0/profile/full_name': fullName.success,
  'GET /v0/profile/service_history': (_req, res) => {
    // user doesnt have any service history or is not authorized
    // return res.status(403).json(genericErrors.error403);

    return res.status(200).json(serviceHistory.airForce);
    // return res
    //   .status(200)
    //   .json(serviceHistory.generateServiceHistoryError('403'));
  },

  'PUT /v0/profile/telephones': (req, res) => {
    if (req?.body?.phoneNumber === '1111111') {
      return res.json(phoneNumber.transactions.receivedNoChangesDetected);
    }
    return res.status(200).json(phoneNumber.transactions.received);
  },
  'POST /v0/profile/telephones': (_req, res) => {
    return res.status(200).json(phoneNumber.transactions.received);
  },
  'POST /v0/profile/email_addresses': (_req, res) => {
    return res.status(200).json(emailAddress.transactions.received);
  },
  'PUT /v0/profile/email_addresses': (_req, res) => {
    return res.status(200).json(emailAddress.transactions.received);
  },
  'PUT /v0/profile/addresses': (req, res) => {
    // uncomment to test 401 error
    // return res.status(401).json(require('../tests/fixtures/401.json'));

    // trigger NO_CHANGES_DETECTED response
    // based on the text 'same' being put into address line 1 of ui
    if (req?.body?.addressLine1 === 'same') {
      return res.json(address.mailingAddressUpdateNoChangeDetected);
    }

    // simulate a initial request returning a transactionId that is
    // subsequently used for triggering error from GET v0/profile/status
    // uncomment to test, and then uses the transactionId 'erroredId' in the status endpoint
    // the status endpoint will return a COMPLETED_FAILURE status based on the string 'error' being in the transactionId
    // return res.json(
    //   _.set(
    //     address.mailingAddressUpdateReceived,
    //     'data.attributes.transactionId',
    //     'erroredId',
    //   ),
    // );

    // to test the update that comes from the 'yes' action on the address change modal prompt,
    // we can create a success response with a transactionId that is unique using date timestamp
    // if (req.body.addressPou === 'CORRESPONDENCE') {
    //   return res.json(
    //     set(
    //       { ...address.mailingAddressUpdateReceived },
    //       'data.attributes.transactionId',
    //       `mailingUpdateId-${new Date().getTime()}`,
    //     ),
    //   );
    // }

    // default response
    return res.json(address.homeAddressUpdateReceived);
  },
  'POST /v0/profile/addresses': (req, res) => {
    return res.json(address.homeAddressUpdateReceived);
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
  'GET /v0/profile/communication_preferences': (req, res) => {
    if (req?.query?.error === 'true') {
      return res.status(500).json(genericErrors.error500);
    }
    return delaySingleResponse(() => res.json(maximalSetOfPreferences), 1);
  },
  'PATCH /v0/profile/communication_preferences/:pref': (req, res) => {
    const {
      communicationItem: {
        id: communicationItemId,
        communicationChannel: {
          id: communicationChannelId,
          communicationPermission: { allowed },
        },
      },
    } = req.body;

    const mockedRes = _.cloneDeep(generateSuccess());

    _.merge(mockedRes, {
      bio: {
        communicationItemId,
        communicationChannelId,
        allowed,
      },
    });

    // uncomment to test 500 error
    // return res.status(500).json(error500);

    delaySingleResponse(() => res.json(mockedRes), 1);
  },

  'GET /v0/profile/contacts': contacts,

  'GET /v0/mocks/history': (_req, res) => {
    return res.json(requestHistory);
  },
};

function terminationHandler(signal) {
  debug(`\nReceived ${signal}`);
  process.env.HAS_RUN_AE_MOCKSERVER = false;
  process.exit();
}

const boot = cb => {
  // this runs once when the mock server starts up
  // uses a environment variable to prevent this from running more than once
  if (!process.env.HAS_RUN_AE_MOCKSERVER) {
    debug('BOOT');
    process.env.HAS_RUN_AE_MOCKSERVER = true;
    cb();

    process.on('SIGINT', terminationHandler);
    process.on('SIGTERM', terminationHandler);
    process.on('SIGQUIT', terminationHandler);
  }
};

// here we can run anything that needs to happen before the mock server starts up
// this runs every time a file is mocked
// but the single boot function will only run once
const generateMockResponses = () => {
  boot(mockLocalDSOT);

  // set DELAY=1000 when running mock server script
  // to add 1 sec delay to all responses
  const responseDelay = process?.env?.DELAY || 0;

  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value === 'function') {
      // add logging to all responses
      responses[key] = (req, res) => {
        logRequest(req);
        return value(req, res);
      };
    }
  });

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
