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
} = require('./endpoints/communication-preferences');
const { generateFeatureToggles } = require('./endpoints/feature-toggles');
const payments = require('./endpoints/payment-history');
const bankAccounts = require('./endpoints/bank-accounts');
const serviceHistory = require('./endpoints/service-history');
const fullName = require('./endpoints/full-name');

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

// some node script utils
const { debug } = require('./script/utils');

// uncomment if using status retries
// let retries = 0;

/* eslint-disable camelcase */
const responses = {
  'GET /v0/user': user.handleUserRequest,
  'GET /v0/profile/status': status,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': generateFeatureToggles({
    profileUseInfoCard: true,
    profileUseFieldEditingPage: true,
    profileShowMhvNotificationSettings: false,
  }),
  'GET /v0/ppiu/payment_information': (_req, res) => {
    // 47841 - Below are the three cases where all of Profile should be gated off
    // payments.paymentHistory.isFiduciary
    // payments.paymentHistory.isDeceased
    // payments.paymentHistory.isNotCompetent

    // This is a 'normal' payment history / control case data
    // payments.paymentHistory.simplePaymentHistory

    return res.status(200).json(payments.paymentHistory.simplePaymentHistory);
  },
  'PUT /v0/ppiu/payment_information': (_req, res) => {
    return res
      .status(200)
      .json(
        _.set(
          payments.paymentInformation.saved.success,
          'data.attributes.error',
          payments.paymentInformation.errors.routingNumberInvalid,
        ),
      );
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
    if (
      req?.params?.id === 'erroredId' ||
      req?.params?.id === '06880455-a2e2-4379-95ba-90aa53fdb273'
    ) {
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
