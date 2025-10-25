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
const {
  updateMemDb,
  updateInProgressForm,
  deleteInProgressForm,
} = require('./script/mem-db');

const notifications = require('../../personalization/common/mocks/notifications');

const {
  createDebtsSuccess,
  createNoDebtsSuccess,
} = require('../../personalization/dashboard/mocks/debts');

const {
  createHealthCareStatusSuccess,
} = require('../../personalization/dashboard/mocks/health-care');

const { v2 } = require('../../personalization/dashboard/mocks/appointments');

// set to true to simulate a user with debts for /v0/debts endpoint
const hasDebts = false;

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

  'GET /v0/in_progress_forms/20-10206': (req, res) => {
    const secondsOfDelay = 1;
    delaySingleResponse(() => res.json(updateMemDb(req)), secondsOfDelay);
  },

  'PUT /v0/in_progress_forms/:id': (req, res) => {
    const secondsOfDelay = 1;
    updateInProgressForm(req.body);
    delaySingleResponse(
      () => res.json(createSaveInProgressUpdate(req)),
      secondsOfDelay,
    );
  },

  'DELETE /v0/in_progress_forms/:id': (req, res) => {
    const secondsOfDelay = 1;
    deleteInProgressForm({});
    delaySingleResponse(
      () =>
        res.json({
          id: '',
          type: 'in_progress_forms',
          attributes: {
            formId: '20-10206',
            createdAt: '2025-04-28T18:32:48.830Z',
            updatedAt: '2025-04-28T18:33:04.820Z',
            metadata: {
              version: 0,
              returnUrl: '/personal-information',
              savedAt: 1745865184476,
              submission: {
                status: false,
                errorMessage: false,
                id: false,
                timestamp: false,
                hasAttemptedSubmit: false,
              },
              createdAt: 1745865168,
              expiresAt: 1751049184,
              lastUpdated: 1745865184,
              inProgressFormId: 44766,
            },
          },
        }),
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
  'POST /v0/profile/address_validation': address.addressValidation,
  'PUT /v0/profile/telephones': (req, res) => {
    // uncomment to test 500 error
    // const shouldError = true;
    // if (shouldError) {
    //   return res.status(500).json(genericErrors.error500);
    // }

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
    // uncomment to test 500 error
    // const shouldError = true;
    // if (shouldError) {
    //   return res.status(500).json(genericErrors.error500);
    // }

    return res
      .status(200)
      .json(updateMemDb(req, emailAddress.transactions.received));
  },
  'PUT /v0/profile/addresses': (req, res) => {
    // uncomment to test 401 error
    // return res.status(401).json(require('../tests/fixtures/401.json'));

    // uncomment to test 500 error
    // const shouldError = true;
    // if (shouldError) {
    //   return res.status(500).json(genericErrors.error500);
    // }

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

  // New endpoints from dashboard mock server
  'GET /v0/medical_copays': (_req, res) => {
    return res.json({ data: [] });
  },

  'GET /v0/profile/payment_history': (_req, res) => {
    return res.json({ data: { attributes: { payments: [] } } });
  },

  'GET /v0/profile/service_history': (_req, res) => {
    return res.json({
      data: {
        attributes: {
          serviceHistory: [],
        },
      },
    });
  },

  'GET /v0/appeals': (_req, res) => {
    return res.json({ data: [] });
  },

  'GET /v0/benefits_claims': (_req, res) => {
    return res.json({ data: [] });
  },

  'GET /v0/health_care_applications/enrollment_status': (_req, res) => {
    return res.json(createHealthCareStatusSuccess());
  },

  'GET /my_health/v1/messaging/folders': (_req, res) => {
    return res.json({ data: [] });
  },

  'GET /v0/my_va/submission_statuses': (_req, res) => {
    return res.json([]);
  },

  'GET /v0/profile/full_name': (_req, res) => {
    return res.json({
      id: '',
      type: 'hashes',
      attributes: {
        first: 'Mitchell',
        middle: 'G',
        last: 'Jenkins',
        suffix: null,
      },
    });
  },

  'GET /v0/debts': (_req, res) => {
    return res.json(hasDebts ? createDebtsSuccess() : createNoDebtsSuccess());
  },

  'GET /v0/onsite_notifications': (_req, res) => {
    return res.json(notifications.none);
  },

  'PATCH /v0/onsite_notifications/:id': (req, res) => {
    const { id } = req.params;

    if (
      id === 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a' ||
      id === 'f9947b27-df3b-4b09-875c-7f76594d766d'
    ) {
      return res.json(notifications.createDismissalSuccessResponse(id));
    }
    if (!id) {
      return notifications.hasError;
    }

    return res.json({ data: [] });
  },

  'GET /v0/disability_compensation_form/rating_info': (_req, res) => {
    return res.json({
      data: {
        id: '',
        type: 'evss_disability_compensation_form_rating_info_responses',
        attributes: {
          userPercentOfDisability: 40,
        },
      },
    });
  },

  'GET /vaos/v2/appointments': (_req, res) => {
    const rv = v2.createAppointmentSuccess({ startsInDays: [31] });
    return res.status(200).json(rv);
  },

  'POST /v0/evidence_documents': (req, res) => {
    return res.status(200).json({
      data: {
        id: '12345',
        type: 'evidence_document',
        attributes: {
          name: 'marriage-certificate.pdf',
          size: 1024,
          uploadedAt: new Date().toISOString(),
        },
      },
    });
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
