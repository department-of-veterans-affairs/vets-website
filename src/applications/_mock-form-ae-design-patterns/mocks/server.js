const delay = require('mocker-api/lib/delay');

const user = require('./endpoints/user');
const handleUserUpdate = require('./endpoints/user/handleUserUpdate');

const address = require('./endpoints/address');
const emailAddress = require('./endpoints/email-addresses');
const phoneNumber = require('./endpoints/phone-number');

const { generateFeatureToggles } = require('./endpoints/feature-toggles');

const serviceHistory = require('./endpoints/service-history');

const maintenanceWindows = require('./endpoints/maintenance-windows');

const {
  prefill,
} = require('./endpoints/in-progress-forms/mock-form-ae-design-patterns');

// transaction status that is used for address, email, phone number update flows
const {
  getEmptyStatus,
  generateStatusResponse,
} = require('./endpoints/status');

// use one of these to provide a generic error response for any endpoint
const genericErrors = {
  error500: require('./errors/500.json'),
  error401: require('./errors/401.json'),
  error403: require('./errors/403.json'),
};

// seed data for VAMC drupal source of truth json file
const mockLocalDSOT = require('./script/drupal-vamc-data/mockLocalDSOT');

// utils
const {
  delaySingleResponse,
  logRequest,
  requestHistory,
  boot,
} = require('./script/utils');

const responses = {
  'GET /v0/in_progress_forms/FORM_MOCK_AE_DESIGN_PATTERNS': (_req, res) => {
    return res.json({
      formData: {
        data: {
          attributes: {
            veteran: {
              ssn: '123-456-7890',
              address: {
                addressLine1: '623 Lesser Dr',
                city: 'Fort Collins',
                stateCode: 'CO',
                zipCode5: '80524',
                countryName: 'USA',
              },
              firstName: 'John',
              lastName: 'Donut',
              middleName: 'Jelly',
              phone: {
                areaCode: '970',
                phoneNumber: '5561289',
              },
              emailAddressText: 'sample@email.com',
            },
          },
        },
        nonPrefill: {
          veteranSsnLastFour: '3607',
          veteranVaFileNumberLastFour: '3607',
        },
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/veteran-details',
      },
    });
  },
  'GET /v0/feature_toggles': (_req, res) => {
    const secondsOfDelay = 0;
    delaySingleResponse(
      () =>
        res.json(
          generateFeatureToggles({
            profileUseExperimental: true,
          }),
        ),
      secondsOfDelay,
    );
  },
  'GET /v0/user': (_req, res) => {
    const shouldError = false; // set to true to test error response
    if (shouldError) {
      return res.status(500).json(genericErrors.error500);
    }

    const [shouldReturnUser, updatedUserResponse] = handleUserUpdate(
      requestHistory,
    );

    if (shouldReturnUser) {
      return res.json(updatedUserResponse);
    }
    // example user data cases
    return res.json(user.loa3User72); // default user LOA3 w/id.me (success)
    // return res.json(user.dsLogonUser); // user with dslogon signIn.serviceName
    // return res.json(user.mvhUser); // user with mhv signIn.serviceName
    // return res.json(user.loa1User); // LOA1 user w/id.me
    // return res.json(user.loa1UserDSLogon); // LOA1 user w/dslogon
    // return res.json(user.loa1UserMHV); // LOA1 user w/mhv
    // return res.json(user.badAddress); // user with bad address
    // return res.json(user.nonVeteranUser); // non-veteran user
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
  'POST /v0/profile/address_validation': address.addressValidation,
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

  'GET /v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS': (_req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => res.json(prefill), secondsOfDelay);
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

  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value === 'function') {
      // add logging to all responses that are functions
      responses[key] = (req, res) => {
        logRequest(req);
        return value(req, res);
      };
    }
  });

  return responseDelay > 0 ? delay(responses, responseDelay) : responses;
};

module.exports = generateMockResponses();
