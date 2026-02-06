const _ = require('lodash');
const delay = require('mocker-api/lib/delay');

// endpoint data or generator functions
const user = require('./endpoints/user');
const mhvAcccount = require('./endpoints/mhvAccount');
const address = require('./endpoints/address');
const schedulingPreferences = require('./endpoints/schedulingPreferences');
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
const powerOfAttorney = require('./endpoints/power-of-attorney');
const bankAccounts = require('./endpoints/bank-accounts');
const serviceHistory = require('./endpoints/service-history');
const vetVerificationStatus = require('./endpoints/vet-verification-status');
const fullName = require('./endpoints/full-name');
const {
  baseUserTransitionAvailabilities,
} = require('./endpoints/user-transition-availabilities');
const connectedApps = require('./endpoints/connected-apps');

const error500 = require('../tests/fixtures/500.json');
const error401 = require('../tests/fixtures/401.json');
const error403 = require('../tests/fixtures/403.json');

const maintenanceWindows = require('./endpoints/maintenance-windows');

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

const contacts = require('../tests/fixtures/contacts.json');
const vamcEhr = require('../tests/fixtures/vamc-ehr.json');
// const contactsSingleEc = require('../tests/fixtures/contacts-single-ec.json');
// const contactsSingleNok = require('../tests/fixtures/contacts-single-nok.json');

// utils
const { debug, delaySingleResponse } = require('./script/utils');
const {
  getEmptyStatus,
  generateStatusResponse,
} = require('./endpoints/status');
const handleUserUpdate = require('./endpoints/user/handleUserUpdate');
const mhvSignature = require('./endpoints/my-health');

// VA Profile initialization simulation setup
// The loa3UserNeedsVapInit user has 'vet360' service available and will trigger initialization
// console.log(
//   '✓ VA Profile initialization simulation enabled - user will need to initialize VA Profile ID when visiting notification settings',
// );

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
            coeAccess: true,
            coeFormRebuildCveteam: true,
            profileHideDirectDeposit: false,
            representativeStatusEnableV2Features: true,
            profileInternationalPhoneNumbers: false,
            profileLimitDirectDepositForNonBeneficiaries: true,
            profileShowCredentialRetirementMessaging: true,
            profileShowNewHealthCareCopayBillNotificationSetting: false,
            profileShowMhvNotificationSettingsEmailAppointmentReminders: true,
            profileShowMhvNotificationSettingsEmailRxShipment: true,
            profileShowMhvNotificationSettingsNewSecureMessaging: false,
            profileShowMhvNotificationSettingsMedicalImages: true,
            profileShowQuickSubmitNotificationSetting: false,
            profileShowNoValidationKeyAddressAlert: false,
            profileUseExperimental: false,
            profileShowPrivacyPolicy: false,
            profileShowPaperlessDelivery: false,
            profile2Enabled: true,
            profileHealthCareSettingsPage: true,
            profileHideHealthCareContacts: true,
            profileHideMissingClaimInformationNotificationSetting: true,
            vetStatusPdfLogging: true,
            veteranStatusCardUseLighthouse: true,
            veteranStatusCardUseLighthouseFrontend: true,
            vreCutoverNotice: true,
            vrePrefillName: true,
            mhvEmailConfirmation: true,
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
    // return res.json(user.loa3UserNeedsVapInit);
    // return res.json(user.loa3UserNoVaProfile); // LOA3 user without VA Profile service
    // return res.json(user.dsLogonUser); // user with dslogon signIn.serviceName
    return res.json(user.mvhUser); // user with mhv signIn.serviceName
    // return res.json(user.loa1User); // LOA1 user w/id.me
    // return res.json(user.loa1UserDSLogon); // LOA1 user w/dslogon
    // return res.json(user.loa1UserMHV); // LOA1 user w/mhv
    // return res.json(user.badAddress); // user with bad address
    // return res.json(user.nonVeteranUser); // non-veteran user
    // return res.json(user.loa3UserWithNoFacilities); // user without facilities and not a vaPatient
    // return res.json(user.externalServiceError); // external service error
    // return res.json(user.loa3UserWithoutLighthouseServiceAvailable); // user without lighthouse service available / no icn or participant id
    // return res.json(user.loa3UserWithNoMobilePhone); // user with no mobile phone number
    // return res.json(user.loa3UserWithNoEmail); // user with no email address
    // return res.json(user.loa3UserWithNoEmailOrMobilePhone); // user without email or mobile phone
    // return res.json(user.loa3UserWithNoHomeAddress); // home address is null
    // return res.json(user.loa3UserWithoutMailingAddress); // user with no mailing address
    // return res.json(user.loa3UserWithInternationalMobilePhoneNumber); // international mobile phone number
    // return res.json(user.loa3UserWithIntlMobilePhoneAndNoEmail); // user with international mobile phone number and no email
    // data claim users
    // return res.json(user.loa3UserWithNoRatingInfoClaim);
    // return res.json(user.loa3UserWithNoMilitaryHistoryClaim);
  },
  'GET /my_health/v1/messaging/preferences/signature': (_req, res) => {
    return res.json(mhvSignature.filledSignature);
    // return res.json(mhvSignature.emptySignature);
  },
  'POST /my_health/v1/messaging/preferences/signature': (_req, res) => {
    const secondsOfDelay = 2;
    const responseBody = mhvSignature.filledSignature; // Simulate successful save
    // const responseBody = mhvSignature.emptySignature; // Simulate successful deletion
    delaySingleResponse(
      () => res.status(200).json(responseBody),
      secondsOfDelay,
    );
    // return res.status(500).json(genericErrors.error500);
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': (_req, res) => {
    return res.json(maintenanceWindows.noDowntime);

    // downtime for VA Profile aka Vet360 (according to service name in response)
    // return res.json(
    //   maintenanceWindows.createDowntimeActiveNotification([
    //     maintenanceWindows.SERVICES.VAPRO_PROFILE_PAGE,
    //     maintenanceWindows.SERVICES.VAPRO_CONTACT_INFO,
    //     maintenanceWindows.SERVICES.LIGHTHOUSE_DIRECT_DEPOSIT,
    //     maintenanceWindows.SERVICES.VAPRO_MILITARY_INFO,
    //     maintenanceWindows.SERVICES.VAPRO_NOTIFICATION_SETTINGS,
    //     maintenanceWindows.SERVICES.VAPRO_HEALTH_CARE_CONTACTS,
    //     maintenanceWindows.SERVICES.VAPRO_PERSONAL_INFO,
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
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.status(200).json(directDeposits.base),
      secondsOfDelay,
    );
    // this endpoint is used for the single form version of the direct deposit page

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
      () => res.status(200).json(directDeposits.updates.success),
      // () => res.status(400).json(directDeposits.updates.errors.invalidDayPhone),
      // () => res.status(422).json(directDeposits.updates.errors.missingPaymentAddress),
      secondsOfDelay,
    );
  },
  'GET /representation_management/v0/power_of_attorney': (_req, res) => {
    const secondsOfDelay = 2;
    delaySingleResponse(
      () => res.status(200).json(powerOfAttorney.organization),
      secondsOfDelay,
    );
  },
  'POST /v0/profile/address_validation': (_req, res) => {
    const addressValidationResponse = 'success';
    delaySingleResponse(() => {
      switch (addressValidationResponse) {
        case 'success':
          return res.status(200).json(address.addressValidation);
        case 'downstreamError':
          return res.status(400).json(address.downstreamError);
        case 'noCandidateFound':
          return res.status(400).json(address.noCandidateFound);
        default:
          return res.status(200).json('');
      }
    }, 1);
  },
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
    const branch = 'army'; // change this value to get different responses
    switch (branch) {
      case 'airForce':
        return res.status(200).json(serviceHistory.airForce);
      case 'army':
        return res.status(200).json(serviceHistory.army);
      case 'coastGuard':
        return res.status(200).json(serviceHistory.coastGuard);
      case 'marineCorps':
        return res.status(200).json(serviceHistory.marineCorps);
      case 'navy':
        return res.status(200).json(serviceHistory.navy);
      case 'spaceForce':
        return res.status(200).json(serviceHistory.spaceForce);
      case 'error403':
        return res
          .status(200)
          .json(serviceHistory.generateServiceHistoryError('403'));
      case 'error500':
        return res
          .status(200)
          .json(serviceHistory.generateServiceHistoryError('500'));
      case 'dishonorableDischarge':
        return res.status(200).json(serviceHistory.dishonorableDischarge);
      case 'unknownDischarge':
        return res.status(200).json(serviceHistory.unknownDischarge);
      default:
        return res.status(200).json(serviceHistory.none);
    }
  },
  'GET /v0/profile/vet_verification_status': (_req, res) => {
    return res.status(200).json(vetVerificationStatus.confirmed);
    // return res.status(200).json(vetVerificationStatus.notConfirmedProblem);
    // return res.status(200).json(vetVerificationStatus.notConfirmedIneligible);
    // return res.status(504).json(vetVerificationStatus.apiError);
  },
  'GET /v0/disability_compensation_form/rating_info': (_req, res) => {
    // return res.status(200).json(ratingInfo.success.serviceConnected0);
    return res.status(200).json(ratingInfo.success.serviceConnected40);
    // return res.status(500).json(genericErrors.error500);
  },

  'PUT /v0/profile/telephones': (req, res) => {
    if (req?.body?.phoneNumber === '1111111') {
      return res.json(phoneNumber.transactions.receivedNoChangesDetected);
    }
    return res.status(200).json(phoneNumber.transactions.received);
    // return res.status(500).json(genericErrors.error500);
  },
  'POST /v0/profile/telephones': (_req, res) => {
    return res.status(200).json(phoneNumber.transactions.received);
  },
  'DELETE /v0/profile/telephones': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.status(200).json(phoneNumber.transactions.received),
      // () => res.status(500).json(genericErrors.error500),
      secondsOfDelay,
    );
  },
  'POST /v0/profile/email_addresses': (_req, res) => {
    return res.status(200).json(emailAddress.transactions.received);
  },
  'PUT /v0/profile/email_addresses': (_req, res) => {
    return res.status(200).json(emailAddress.transactions.received);
    // return res.status(500).json(genericErrors.error500);
  },
  'DELETE /v0/profile/email_addresses': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.status(200).json(emailAddress.transactions.received),
      // () => res.status(500).json(genericErrors.error500),
      secondsOfDelay,
    );
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
    // return res.status(500).json(genericErrors.error500);
  },
  'POST /v0/profile/addresses': (req, res) => {
    return res.json(address.homeAddressUpdateReceived);
  },
  'DELETE /v0/profile/addresses': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(
      () => res.status(200).json(address.homeAddressDeleteReceived),
      // () => res.status(500).json(genericErrors.error500),
      secondsOfDelay,
    );
  },
  'GET /v0/profile/status': getEmptyStatus, // simulate no status / no transactions pending
  'GET /v0/profile/status/:id': (req, res) => {
    // this function allows some conditional logic to be added to the status endpoint
    // to simulate different responses based on the transactionId param
    return generateStatusResponse(req, res);
  },
  'POST /v0/profile/initialize_vet360_id': (req, res) => {
    // Simulate VA Profile initialization transaction
    const transactionId = `init-vap-${new Date().getTime()}`;
    const initializationTransaction = {
      data: {
        type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
        attributes: {
          transactionId,
          transactionStatus: 'RECEIVED',
          type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
          metadata: [],
        },
      },
    };

    // Return the transaction immediately - status will be checked via status endpoint
    return res.json(initializationTransaction);
  },
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  'GET /v0/profile/communication_preferences': (req, res) => {
    if (req?.query?.error === 'true') {
      return res.status(500).json(genericErrors.error500);
    }
    return delaySingleResponse(() => res.json(maximalSetOfPreferences), 1);
  },
  'GET /v0/profile/scheduling_preferences': (req, res) => {
    const schedulingPreferencesResponse = 'all';
    delaySingleResponse(() => {
      switch (schedulingPreferencesResponse) {
        case 'all':
          return res.status(200).json(schedulingPreferences.all);
        case 'none':
          return res.status(200).json(schedulingPreferences.none);
        case 'error':
          return res.status(500).json(genericErrors.error500);
        default:
          return res.status(200).json('');
      }
    }, 1);
  },
  'POST /v0/profile/scheduling_preferences': (req, res) => {
    return delaySingleResponse(
      () =>
        res.status(200).json({
          data: {
            id: '',
            type: 'async_transaction_va_profile_scheduling_transactions',
            attributes: {
              transactionId: '94725087-d546-47e1-a247-f57ab0ed599c',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::VAProfile::SchedulingTransaction',
              metadata: [],
            },
          },
        }),
      1,
    );
  },
  'DELETE /v0/profile/scheduling_preferences': (req, res) => {
    return delaySingleResponse(
      () =>
        res.status(200).json({
          data: {
            id: '',
            type: 'async_transaction_va_profile_scheduling_transactions',
            attributes: {
              transactionId: '94725087-d546-47e1-a247-f57ab0ed599c',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::VAProfile::SchedulingTransaction',
              metadata: [],
            },
          },
        }),
      1,
    );
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

  'GET /v0/profile/connected_applications': (req, res) => {
    return delaySingleResponse(() => res.json(connectedApps.connectedApps), 1);
  },
  'DELETE /v0/profile/connected_applications/:appId': (req, res) => {
    return delaySingleResponse(
      () => connectedApps.deleteConnectedApp(req, res),
      1,
    );
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
