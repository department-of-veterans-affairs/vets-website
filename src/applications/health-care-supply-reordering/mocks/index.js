/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const mdot = require('./mdot/index');

const toggleVeteranNotFoundError = false;
const toggleInternalServerError = false;

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /v0/in_progress_forms/mdot': (req, res) => {
    if (toggleVeteranNotFoundError) {
      return res
        .status(mdot.veteranNotFoundResponse.status)
        .json(mdot.veteranNotFoundResponse.data);
    }
    if (toggleInternalServerError) {
      return res
        .status(mdot.internalServerError.status)
        .json(mdot.internalServerError.data);
    }
    return res.status(200).json(mdot.suppliesResponse);
  },
  'POST /v0/mdot/supplies': [
    { status: 'Order Processed', orderId: 10661, productId: 6650 },
  ],
  'PUT /v0/in_progress_forms/MDOT': {
    data: {
      id: '10661',
      type: 'in_progress_forms',
      attributes: {
        formId: 'MDOT',
        createdAt: '2020-06-30T00:00:00.000Z',
        updatedAt: '2020-06-30T00:00:00.000Z',
        metadata: {
          version: 1,
          returnUrl: '/review-and-submit',
          savedAt: 1593500000000,
          lastUpdated: 1593500000000,
          expiresAt: 99999999999,
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          inProgressFormId: 1234,
        },
      },
    },
  },
};

module.exports = delay(responses, 2000);
