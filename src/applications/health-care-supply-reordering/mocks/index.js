/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const mdot = require('./mdot/index');
const maintenance_windows = require('./maintenance-windows/index');

const toggleVeteranNotFoundError = false;
const toggleInternalServerError = false;

// eslint-disable-next-line no-unused-vars
const signedOut = {
  errors: [
    {
      title: 'Not authorized',
      detail: 'Not authorized',
      code: '401',
      status: '401',
    },
  ],
};

const getIpfMdotResponse = (req, res) => {
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

  // temporaryAddress cases to consider:
  //  - fields null
  //  - fields empty
  //  - temporaryAddress empty object
  //  - no temporaryAddress field
  // const { formData, metadata } = mdot.suppliesResponse;
  // Object.keys(formData.temporaryAddress).forEach(key => {
  //   formData.temporaryAddress[key] = '';
  //   // formData.temporaryAddress[key] = null;
  // });
  // formData.temporaryAddress = {};
  // delete formData.temporaryAddress;
  // return res.status(200).json({ formData, metadata });
  return res.status(200).json(mdot.suppliesResponse);
};

const putIpfMdotResponse = {
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
};

// eslint-disable-next-line no-unused-vars
const orderSuccess = [
  { status: 'Order Processed', orderId: 10661, productId: 6650 },
];

// eslint-disable-next-line no-unused-vars
const orderFail = [
  {
    status:
      'Unable to order item since the last order was less than 5 months ago.',
    orderId: 0,
    productId: 6650,
  },
];

const responses = {
  'GET /v0/user': user.defaultUser,
  // 'GET /v0/user': signedOut,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
  'GET /v0/in_progress_forms/mdot': getIpfMdotResponse,
  // 'GET /v0/in_progress_forms/mdot': signedOut,
  // 'POST /v0/mdot/supplies': orderSuccess,
  'POST /v0/mdot/supplies': orderFail,
  'PUT /v0/in_progress_forms/MDOT': putIpfMdotResponse,
  'GET /v0/maintenance_windows': (_, response) =>
    response.json(maintenance_windows),
  'OPTIONS /v0/maintenance_windows': 'OK',
};

module.exports = delay(responses, 500);
