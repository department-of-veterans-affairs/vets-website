const _ = require('lodash');
const delay = require('mocker-api/lib/delay');
const { set } = require('lodash');

// endpoint data or generator functions
const user = require('./endpoints/user');
const mhvAcccount = require('./endpoints/mhvAccount');
const address = require('./endpoints/address');
const emailAddress = require('./endpoints/email-adresses');
const phoneNumber = require('./endpoints/phone-number');
const status = require('./endpoints/status');
const ratingInfo = require('./endpoints/rating-info');
const {
  handlePutGenderIdentitiesRoute,
  handleGetPersonalInformationRoute,
  handlePutPreferredNameRoute,
} = require('./endpoints/personal-information');
const {
  maximalSetOfPreferences,
  generateSuccess,
} = require('./endpoints/communication-preferences');
const { generateFeatureToggles } = require('./endpoints/feature-toggles');
const mockDisabilityCompensations = require('./endpoints/disability-compensations');
const bankAccounts = require('./endpoints/bank-accounts');
const serviceHistory = require('./endpoints/service-history');
const fullName = require('./endpoints/full-name');
const {
  baseUserTransitionAvailabilities,
} = require('./endpoints/user-transition-availabilities');

const error500 = require('../tests/fixtures/500.json');
const error401 = require('../tests/fixtures/401.json');
const error403 = require('../tests/fixtures/403.json');

const maintenanceWindows = require('./endpoints/maintenance-windows');

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

const contacts = require('../tests/fixtures/contacts.json');

// utils
const { debug, delaySingleResponse } = require('./script/utils');

// uncomment if using status retries
// let retries = 0;

// use one of these to provide a generic error for any endpoint
const genericErrors = {
  error500,
  error401,
  error403,
};

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': (_req, res) => {
    const secondsOfDelay = 0;
    delaySingleResponse(
      () =>
        res.json(
          generateFeatureToggles({
            authExpVbaDowntimeMessage: false,
            profileContacts: true,
            profileUseHubPage: true,
            profileShowEmailNotificationSettings: true,
            profileShowMhvNotificationSettings: true,
            profileShowPaymentsNotificationSetting: true,
            profileShowProofOfVeteranStatus: true,
            profileShowQuickSubmitNotificationSetting: true,
            profileUseExperimental: true,
          }),
        ),
      secondsOfDelay,
    );
  },
  'GET /v0/user': (_req, res) => {
    // return res.status(403).json(genericErrors.error500);
    // example user data cases
    return res.json(user.loa3User72); // default user (success)
    // return res.json(user.loa1User); // user with loa1
    // return res.json(user.badAddress); // user with bad address
    // return res.json(user.loa3User); // user with loa3
    // return res.json(user.nonVeteranUser); // non-veteran user
    // return res.json(user.externalServiceError); // external service error
    // return res.json(user.loa3UserWithNoMobilePhone); // user with no mobile phone number
    // return res.json(user.loa3UserWithNoEmail); // user with no email address
    // return res.json(user.loa3UserWithNoEmailOrMobilePhone); // user without email or mobile phone
    // return res.json(user.loa3UserWithNoHomeAddress); // home address is null
    // return res.json(user.loa3UserWithoutMailingAddress); // user with no mailing address
    // data claim users
    // return res.json(user.loa3UserWithNoRatingInfoClaim);
    // return res.json(user.loa3UserWithNoMilitaryHistoryClaim);
  },
  'GET /v0/profile/status': status.success,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': (_req, res) => {
    // three different scenarios for testing downtime banner
    // all service names/keys are available in src/platform/monitoring/DowntimeNotification/config/externalService.js
    // but couldn't be directly imported due to export default vs module.exports

    // return res.json(
    //   maintenanceWindows.createDowntimeApproachingNotification([
    //     maintenanceWindows.SERVICES.EMIS,
    //   ]),
    // );

    // return res.json(
    //   maintenanceWindows.createDowntimeActiveNotification([
    //     maintenanceWindows.SERVICES.MVI,
    //     maintenanceWindows.SERVICES.EMIS,
    //   ]),
    // );

    return res.json(maintenanceWindows.noDowntime);
  },

  'GET /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    // return res.status(500).json(genericErrors.error500);

    // Lighthouse based API endpoint for direct deposit CNP
    // happy path response / user with data
    return res.json(mockDisabilityCompensations.base);

    // edge cases
    // return res.json(mockDisabilityCompensations.isDeceased);
    // return res.json(mockDisabilityCompensations.isFiduciary);
    // return res.json(mockDisabilityCompensations.isNotCompetent);
    // return res.json(mockDisabilityCompensations.isNotEligible);
  },
  'PUT /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    return res
      .status(200)
      .json(mockDisabilityCompensations.updates.errors.invalidAccountNumber);
    // return res.status(200).json(disabilityComps.updates.success);
  },
  'POST /v0/profile/address_validation': address.addressValidation,
  'GET /v0/mhv_account': mhvAcccount.needsPatient,
  'GET /v0/profile/personal_information': handleGetPersonalInformationRoute,
  'PUT /v0/profile/preferred_names': handlePutPreferredNameRoute,
  'PUT /v0/profile/gender_identities': handlePutGenderIdentitiesRoute,
  'GET /v0/profile/full_name': fullName.success,
  'GET /v0/profile/ch33_bank_accounts': (_req, res) => {
    return res.status(200).json(bankAccounts.anAccount);
  },
  'PUT /v0/profile/ch33_bank_accounts': (_req, res) => {
    return res.status(200).json(bankAccounts.saved.success);
  },
  'GET /v0/profile/service_history': (_req, res) => {
    // user doesnt have any service history or is not authorized
    // return res.status(403).json(genericErrors.error403);

    return res.status(200).json(serviceHistory.airForce);
    // return res
    //   .status(200)
    //   .json(serviceHistory.generateServiceHistoryError('403'));
  },
  'GET /v0/disability_compensation_form/rating_info': (_req, res) => {
    return res.status(200).json(ratingInfo.success);
    // return res.status(500).json(genericErrors.error500);
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
    // return res.json(
    //   _.set(
    //     address.mailingAddressUpdateReceived.response,
    //     'data.attributes.transactionId',
    //     'erroredId',
    //   ),
    // );

    // to test the update that comes from the 'yes' action on the address change modal prompt,
    // we can create a success response with a transactionId that is unique using date timestamp
    if (req.body.addressPou === 'CORRESPONDENCE') {
      return res.json(
        set(
          { ...address.mailingAddressUpdateReceived.response },
          'data.attributes.transactionId',
          `mailingUpdateId-${new Date().getTime()}`,
        ),
      );
    }

    // default response
    return res.json(address.homeAddressUpdateReceived.response);
  },
  'POST /v0/profile/addresses': (req, res) => {
    return res.json(address.homeAddressUpdateReceived.response);
  },
  'GET /v0/profile/status/:id': (req, res) => {
    // uncomment this to simlulate multiple status calls
    // aka long latency on getting update to go through
    // if (retries < 2) {
    //   retries += 1;
    //   return res.json(phoneNumber.transactions.received);
    // }

    // uncomment to conditionally provide a failure error code based on transaction id
    if (req?.params?.id === 'erroredId') {
      return res.json(
        _.set(status.failure, 'data.attributes.transactionId', req.params.id),
      );
    }

    return res.json(
      _.set(status.success, 'data.attributes.transactionId', req.params.id),
    );
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

  'GET /v0/user_transition_availabilities': baseUserTransitionAvailabilities,
  // 'GET /v0/profile/contacts': {}, // simulate no contacts
  'GET /v0/profile/contacts': contacts,
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

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
