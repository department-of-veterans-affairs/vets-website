const delay = require('mocker-api/lib/delay');
const { generateFeatureToggles } = require('./feature-toggles');
const user = require('./users');
const { createSuccessPayment } = require('./payment-history');
const { createAppealsSuccess } = require('./appeals-success');
const { createDebtsSuccess } = require('./debts');
const { createClaimsSuccess } = require('./evss-claims');
const { createHealthCareStatusSuccess } = require('./health-care');
const { v0, v2 } = require('./appointments');

/* eslint-disable camelcase */
const responses = {
  'GET /v0/feature_toggles': generateFeatureToggles({
    profileUseVaosV2Api: true,
  }),
  'GET /v0/user': user.cernerUser,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/profile/payment_history': createSuccessPayment(true),
  'GET /v0/appeals': createAppealsSuccess(),
  'GET /v0/evss_claims_async': createClaimsSuccess(),
  'GET /v0/health_care_applications/enrollment_status': createHealthCareStatusSuccess(),
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
  'GET /v0/debts': createDebtsSuccess(),
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
  'GET /vaos/v0/appointments': (req, res) => {
    const { query } = req;
    const { type } = query;

    if (type === 'va' || type === 'cc') {
      const rv = v0.createAppointmentSuccess(type);
      return res.status(200).json(rv);
    }
    return res.status(400).json({ bad: 'type' });
  },
  'GET /vaos/v2/appointments': (_req, res) => {
    const rv = v2.createAppointmentSuccess({ startsInDays: [31] });
    return res.status(200).json(rv);
  },
};

module.exports = delay(responses, 2000);
