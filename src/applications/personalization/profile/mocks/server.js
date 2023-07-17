const _ = require('lodash');
const delay = require('mocker-api/lib/delay');
const { set } = require('lodash');

// endpoint data or generator functions
const user = require('./endpoints/user');
const mhvAcccount = require('./endpoints/mhvAccount');
const address = require('./endpoints/address');
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
const paymentInformation = require('./endpoints/payment-information');
const disabilityComps = require('./endpoints/disability-compensations');
const bankAccounts = require('./endpoints/bank-accounts');
const serviceHistory = require('./endpoints/service-history');
const fullName = require('./endpoints/full-name');
const {
  baseUserTransitionAvailabilities,
} = require('./endpoints/user-transition-availabilities');

const maintenanceWindows = require('./endpoints/maintenance-windows');

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

// utils
const { debug, delaySingleResponse } = require('./script/utils');

// uncomment if using status retries
// let retries = 0;

/* eslint-disable camelcase */
const responses = {
  'GET /v0/user': user.handleUserRequest,
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
  'GET /v0/feature_toggles': (_req, res) => {
    delaySingleResponse(
      () =>
        res.json(
          generateFeatureToggles({
            profileUseInfoCard: true,
            profileUseFieldEditingPage: true,
            profileLighthouseDirectDeposit: true,
            profileUseNotificationSettingsCheckboxes: false,
            profileShowEmailNotificationSettings: false,
            profileShowMhvNotificationSettings: false,
            profileShowPaymentsNotificationSetting: false,
            profileShowQuickSubmitNotificationSetting: false,
          }),
        ),
      0,
    );
  },
  'GET /v0/ppiu/payment_information': (_req, res) => {
    // 47841 - Below are the three cases where all of Profile should be gated off
    // paymentInformation.isFiduciary
    // paymentInformation.isDeceased
    // paymentInformation.isNotCompetent

    // This is a 'normal' payment history / control case data
    // paymentInformation.base

    return res.status(200).json(paymentInformation.notEligible);
  },
  'PUT /v0/ppiu/payment_information': (_req, res) => {
    // substitute the various errors arrays to test various update error responses
    // Examples:
    // paymentInformation.updates.errors.fraud
    // paymentsInformation.updates.errors.phoneNumber
    // paymentsInformation.updates.errors.address
    // return res
    //   .status(200)
    //   .json(
    //     _.set(
    //       _.cloneDeep(paymentInformation.base),
    //       'data.attributes.error',
    //       paymentInformation.updates.errors.invalidAddress,
    //     ),
    //   );

    // successful update response
    return res.status(200).json(paymentInformation.updates.success);
  },
  'GET /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    // Lighthouse based API endpoint for direct deposit CNP
    // alternate to the PPIU endpoint above: /v0/ppiu/payment_information
    return res.json(disabilityComps.base);
  },
  'PUT /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    return res.status(200).json(disabilityComps.updates.success);
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
    return res.status(200).json(serviceHistory.airForce);
    // return res
    //   .status(200)
    //   .json(serviceHistory.generateServiceHistoryError('403'));
  },
  'GET /v0/disability_compensation_form/rating_info':
    ratingInfo.success.serviceConnected40,
  'PUT /v0/profile/telephones': (_req, res) => {
    return res.status(200).json(phoneNumber.transactions.received);
  },
  'POST /v0/profile/telephones': (_req, res) => {
    return res.status(200).json(phoneNumber.transactions.received);
  },
  'PUT /v0/profile/addresses': (req, res) => {
    // return res.status(401).json(require('../tests/fixtures/401.json'));

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

    // simulate a initial request returning a transactionId that is
    // subsequently used for triggereing error from GET v0/profile/status
    // return res.json(
    //   _.set(
    //     address.mailingAddressUpdateReceived.response,
    //     'data.attributes.transactionId',
    //     'erroredId',
    //   ),
    // );

    // trigger NO_CHANGES_DETECTED response
    // based on the text 'same' being put into address line 1 of ui
    if (req?.body?.addressLine1 === 'same') {
      return res.json(address.mailingAddresUpdateNoChangeDetected);
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
  'GET /v0/profile/communication_preferences': (_req, res) => {
    return res.json(maximalSetOfPreferences);
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

    delaySingleResponse(() => res.json(mockedRes), 1);
  },

  'GET /v0/user_transition_availabilities': baseUserTransitionAvailabilities,
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
