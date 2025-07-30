const delay = require('mocker-api/lib/delay');
const {
  generateFeatureToggles,
} = require('../../common/mocks/feature-toggles');
const user = require('../../common/mocks/users');
const notifications = require('../../common/mocks/notifications');
const {
  createEmptyPayment,
  createSuccessPayment,
  createFailurePayment,
} = require('./payment-history');
const { createAppealsSuccess, createAppealsFailure } = require('./appeals');
const {
  createDebtsSuccess,
  createNoDebtsSuccess,
  createDebtsFailure,
} = require('./debts');
const { createClaimsSuccess, createClaimsFailure } = require('./claims');
const { createHealthCareStatusSuccess } = require('./health-care');
const { createApplications } = require('./benefit-applications');
const { allFoldersWithUnreadMessages } = require('./messaging');
const {
  user81Copays,
  user81ErrorCopays,
  user81NoCopays,
} = require('./medical-copays');
const { v2 } = require('./appointments');
const mockLocalDSOT = require('../../common/mocks/script/drupal-vamc-data/mockLocalDSOT');
const { boot } = require('../../common/mocks/script/utils');
const { delaySingleResponse } = require('../../profile/mocks/script/utils');
const {
  createDisabilityRatingFailure,
  createDisabilityRatingSuccess,
  createDisabilityRatingEmpty,
  createDisabilityRatingZero,
} = require('./disability-rating');

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles(
    {
      authExpVbaDowntimeMessage: false,
      myVaUseExperimental: false,
      veteranOnboardingBetaFlow: false,
      myVaFormSubmissionStatuses: true,
      myVaFormPdfLink: true,
      veteranOnboardingShowWelcomeMessageToNewUsers: true,
      myVaAuthExpRedesignEnabled: false,
    },
    true,
  ),
  'GET /v0/user': user.simpleUser, // This is an LOA3 user
  // 'GET /v0/user': user.loa3UserWithNoEmail, // This is simpleUser with no email
  // 'GET /v0/user': user.loa1SimpleUser,
  // 'GET /v0/user': user.loa1UserWithNoEmail,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/medical_copays': (req, res) => {
    const copayStatus = 'success';
    switch (copayStatus) {
      case 'success':
        return res.status(200).json(user81Copays);
      case 'empty':
        return res.status(200).json(user81NoCopays);
      case 'failure':
        return res.status(500).json(user81ErrorCopays);
      default:
        return res.status(200).json('');
    }
  },
  'GET /v0/profile/payment_history': (req, res) => {
    const paymentHistoryStatus = 'success';
    switch (paymentHistoryStatus) {
      case 'success':
        return res.status(200).json(createSuccessPayment(false));
      case 'empty':
        return res.status(200).json(createEmptyPayment());
      case 'failure':
        return res.status(500).json(createFailurePayment());
      default:
        return res.status(200).json('');
    }
  },
  'GET /v0/profile/service_history': {
    data: {
      id: '',
      type: 'arrays',
      attributes: {
        dataSource: 'api.va_profile',
        serviceHistory: [
          {
            branchOfService: 'Air Force',
            beginDate: '2009-04-12',
            endDate: '2013-04-11',
            periodOfServiceTypeCode: 'V',
            periodOfServiceTypeText: 'Reserve member',
            characterOfDischargeCode: 'A',
          },
        ],
      },
    },
  },
  'GET /v0/appeals': (_req, res) => {
    const appealsStatus = 'success'; // 'success', 'failure', or 'empty'
    switch (appealsStatus) {
      case 'success':
        return res.status(200).json(createAppealsSuccess());
      case 'empty':
        return res.status(200).json({ data: [] });
      case 'failure':
        return res.status(400).json(createAppealsFailure());
      default:
        return '';
    }
  },
  'GET /v0/benefits_claims': (_req, res) => {
    const claimsStatus = 'success'; // 'success', 'failure', or 'empty'
    switch (claimsStatus) {
      case 'success':
        return res.status(200).json(createClaimsSuccess());
      case 'empty':
        return res.status(200).json({ data: [] });
      case 'failure':
        return res.status(400).json(createClaimsFailure());
      default:
        return '';
    }
  },
  'GET /v0/health_care_applications/enrollment_status': createHealthCareStatusSuccess(),
  'GET /my_health/v1/messaging/folders': allFoldersWithUnreadMessages,
  'GET /v0/my_va/submission_statuses': createApplications(),
  'POST /v0/my_va/submission_pdf_urls': (_req, res) => {
    // return res.status(500).json({
    //   error: 'bad request',
    // });
    const secondsOfDelay = 2;
    delaySingleResponse(
      () =>
        res.status(200).json({
          url: 'https://example.com/form.pdf',
        }),
      secondsOfDelay,
    );
  },
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
  'GET /v0/debts': (req, res) => {
    const debtStatus = 'success';
    switch (debtStatus) {
      case 'success':
        return res.status(200).json(createDebtsSuccess());
      case 'empty':
        return res.status(200).json(createNoDebtsSuccess());
      case 'failure':
        return res.status(500).json(createDebtsFailure());
      default:
        return res.status(200).json('');
    }
  },
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
  'GET /v0/disability_compensation_form/rating_info': (_req, res) => {
    const disabilityRatingStatus = 'success'; // 'success', 'failure', 'empty', or 'zero'
    switch (disabilityRatingStatus) {
      case 'success':
        return res.status(200).json(createDisabilityRatingSuccess());
      case 'empty':
        return res.status(200).json(createDisabilityRatingEmpty());
      case 'zero':
        return res.status(200).json(createDisabilityRatingZero());
      case 'failure':
        return res.status(400).json(createDisabilityRatingFailure());
      default:
        return '';
    }
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
