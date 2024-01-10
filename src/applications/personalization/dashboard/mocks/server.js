const delay = require('mocker-api/lib/delay');
const {
  generateFeatureToggles,
} = require('../../common/mocks/feature-toggles');
const user = require('../../common/mocks/users');
const notifications = require('../../common/mocks/notifications');
const { createSuccessPayment } = require('./payment-history');
const { createAppealsSuccess } = require('./appeals-success');
const { createDebtsSuccess, createNoDebtsSuccess } = require('./debts');
const { createClaimsSuccess } = require('./claims');
const { createHealthCareStatusSuccess } = require('./health-care');
const { allFoldersWithUnreadMessages } = require('./messaging');
const { user81Copays } = require('./medical-copays');
const { v2 } = require('./appointments');
const mockLocalDSOT = require('../../common/mocks/script/drupal-vamc-data/mockLocalDSOT');
const { boot } = require('../../common/mocks/script/utils');

// set to true to simulate a user with debts for /v0/debts endpoint
const hasDebts = false;

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles({
    authExpVbaDowntimeMessage: false,
    myVaEnableNotificationComponent: true,
    myVaUseExperimental: false,
    myVaUseExperimentalFrontend: true,
    myVaUseExperimentalFullstack: true,
    myVaHideNotificationsSection: true,
    myVaNotificationDotIndicator: true,
    myVaEnableMhvLink: true,
    myVaUpdateErrorsWarnings: true,
    vaOnlineSchedulingStaticLandingPage: true,
  }),
  'GET /v0/user': user.simpleUser,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/medical_copays': user81Copays,
  'GET /v0/profile/payment_history': createSuccessPayment(false),
  'GET /v0/appeals': createAppealsSuccess(),
  'GET /v0/benefits_claims': createClaimsSuccess(),
  'GET /v0/health_care_applications/enrollment_status': createHealthCareStatusSuccess(),
  'GET /my_health/v1/messaging/folders': allFoldersWithUnreadMessages,
  'GET /v0/profile/full_name': {
    id: '',
    type: 'hashes',
    attributes: {
      first: 'Mitchell',
      middle: 'G',
      last: 'Jenkins',
      suffix: null,
    },
  },
  'GET /v0/debts': hasDebts ? createDebtsSuccess() : createNoDebtsSuccess(),
  'GET /v0/onsite_notifications': notifications.hasMultiple,
  // TODO: put id into a constant file when we get more notification types
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
  'GET /v0/profile/service_history': {
    data: {
      id: '',
      type: 'arrays',
      attributes: {
        serviceHistory: [],
      },
    },
  },
  'GET /v0/disability_compensation_form/rating_info': {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: 40,
      },
    },
  },
  'GET /vaos/v2/appointments': (_req, res) => {
    const rv = v2.createAppointmentSuccess({ startsInDays: [31] });
    return res.status(200).json(rv);
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
