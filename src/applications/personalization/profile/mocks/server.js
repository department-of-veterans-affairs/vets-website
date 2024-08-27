const _ = require('lodash');
const delay = require('mocker-api/lib/delay');

// endpoint data or generator functions
const user = require('./endpoints/user');
const mhvAcccount = require('./endpoints/mhvAccount');
const address = require('./endpoints/address');
const emailAddress = require('./endpoints/email-adresses');
const phoneNumber = require('./endpoints/phone-number');
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
const directDeposits = require('./endpoints/direct-deposits');
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
// const contactsSingleEc = require('../tests/fixtures/contacts-single-ec.json');
// const contactsSingleNok = require('../tests/fixtures/contacts-single-nok.json');

// utils
const { debug, delaySingleResponse } = require('./script/utils');
const {
  getEmptyStatus,
  generateStatusResponse,
} = require('./endpoints/status');
const handleUserUpdate = require('./endpoints/user/handleUserUpdate');

// use one of these to provide a generic error for any endpoint
const genericErrors = {
  error500,
  error401,
  error403,
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
            profileHideDirectDeposit: true,
            profileShowCredentialRetirementMessaging: true,
            profileShowPaymentsNotificationSetting: true,
            profileShowMhvNotificationSettingsEmailAppointmentReminders: false,
            profileShowMhvNotificationSettingsEmailRxShipment: true,
            profileShowMhvNotificationSettingsNewSecureMessaging: true,
            profileShowMhvNotificationSettingsMedicalImages: true,
            profileShowQuickSubmitNotificationSetting: false,
            profileUseExperimental: true,
            profileShowDirectDepositSingleForm: true,
            profileShowDirectDepositSingleFormUAT: false,
            profileShowDirectDepositSingleFormAlert: true,
            profileShowDirectDepositSingleFormEduDowntime: true,
            profileShowPrivacyPolicy: true,
            veteranOnboardingContactInfoFlow: true,
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
    // return res.status(403).json(genericErrors.error500);
    // example user data cases
    // return res.json(user.loa3User72); // default user LOA3 w/id.me (success)
    // return res.json(user.dsLogonUser); // user with dslogon signIn.serviceName
    // return res.json(user.mvhUser); // user with mhv signIn.serviceName
    // return res.json(user.loa1User); // LOA1 user w/id.me
    // return res.json(user.loa1UserDSLogon); // LOA1 user w/dslogon
    // return res.json(user.loa1UserMHV); // LOA1 user w/mhv
    // return res.json(user.badAddress); // user with bad address
    // return res.json(user.nonVeteranUser); // non-veteran user
    return res.json(user.loa3UserWithNoFacilities); // user without facilities and not a vaPatient
    // return res.json(user.externalServiceError); // external service error
    // return res.json(user.loa3UserWithoutLighthouseServiceAvailable); // user without lighthouse service available / no icn or participant id
    // return res.json(user.loa3UserWithNoMobilePhone); // user with no mobile phone number
    // return res.json(user.loa3UserWithNoEmail); // user with no email address
    // return res.json(user.loa3UserWithNoEmailOrMobilePhone); // user without email or mobile phone
    // return res.json(user.loa3UserWithNoHomeAddress); // home address is null
    // return res.json(user.loa3UserWithoutMailingAddress); // user with no mailing address
    // data claim users
    // return res.json(user.loa3UserWithNoRatingInfoClaim);
    // return res.json(user.loa3UserWithNoMilitaryHistoryClaim);
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

  'GET /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    // return res.status(500).json(genericErrors.error500);

    // Lighthouse based API endpoint for direct deposit CNP
    // happy path response / user with data
    return res.json(mockDisabilityCompensations.base);

    // user with no dd data but is eligible
    // return res.json(mockDisabilityCompensations.isEligible);

    // direct deposit blocked edge cases
    // return res.json(mockDisabilityCompensations.isDeceased);
    // return res.json(mockDisabilityCompensations.isFiduciary);
    // return res.json(mockDisabilityCompensations.isNotCompetent);
    // return res.json(mockDisabilityCompensations.isNotEligible);
  },
  'PUT /v0/profile/direct_deposits/disability_compensations': (_req, res) => {
    const secondsOfDelay = 2;
    delaySingleResponse(
      () => res.status(200).json(mockDisabilityCompensations.updates.success),
      secondsOfDelay,
    );
    // return res
    //   .status(400)
    //   .json(mockDisabilityCompensations.updates.errors.invalidRoutingNumber);
    // return res.status(200).json(mockDisabilityCompensations.updates.success);
  },
  'GET /v0/profile/direct_deposits': (_req, res) => {
    // this endpoint is used for the single form version of the direct deposit page
    return res.status(200).json(directDeposits.base);
    // return res.status(500).json(genericErrors.error500);
    // return res.status(400).json(directDeposits.updates.errors.unspecified);
    // user with no dd data but is eligible
    // return res.json(directDeposits.isEligible);
    // direct deposit blocked edge cases
    // return res.json(directDeposits.isDeceased);
    // return res.json(directDeposits.isFiduciary);
    // return res.json(directDeposits.isNotCompetent);
    // return res.json(directDeposits.isNotEligible);
  },
  'PUT /v0/profile/direct_deposits': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      // () => res.status(500).json(error500),
      // () => res.status(200).json(mockDisabilityCompensations.updates.success),
      () => res.status(400).json(directDeposits.updates.errors.invalidDayPhone),
      secondsOfDelay,
    );
  },
  'POST /v0/profile/address_validation': address.addressValidation,
  'GET /v0/mhv_account': mhvAcccount.needsPatient,
  'GET /v0/profile/personal_information': handleGetPersonalInformationRoute,
  'PUT /v0/profile/preferred_names': handlePutPreferredNameRoute,
  'PUT /v0/profile/gender_identities': handlePutGenderIdentitiesRoute,
  'GET /v0/profile/full_name': fullName.success,
  'GET /v0/profile/ch33_bank_accounts': (_req, res) => {
    // return res.status(200).json(bankAccounts.noAccount); // user with no account / not eligible
    // return res.status(500).json(bankAccounts.errorResponse); // error response
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

  'GET /v0/user_transition_availabilities': baseUserTransitionAvailabilities,
  // 'GET /v0/profile/contacts': { data: [] }, // simulate no contacts
  // 'GET /v0/profile/contacts': (_req, res) => res.status(500).json(genericErrors.error500), // simulate error
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
