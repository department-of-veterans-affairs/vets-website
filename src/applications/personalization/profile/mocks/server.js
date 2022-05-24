const _ = require('lodash');
const delay = require('mocker-api/lib/delay');
const user = require('./user');
const mhvAcccount = require('./mhvAccount');
const address = require('./address');
const status = require('./status');
const {
  handlePutGenderIdentitiesRoute,
  handleGetPersonalInformationRoute,
  handlePutPreferredNameRoute,
} = require('./personal-information');
const { createNotificationSuccess } = require('./notifications');

const { generateFeatureToggles } = require('./feature-toggles');

const { paymentHistory } = require('./payment-history');

const bankAccounts = require('./bank-accounts');

/* eslint-disable camelcase */
const responses = {
  'GET /v0/user': user.badAddress,
  'GET /v0/profile/status': status,
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/feature_toggles': generateFeatureToggles(),
  'GET /v0/ppiu/payment_information': (_req, res) => {
    return res.status(200).json(paymentHistory.simplePaymentHistory);
  },
  'POST /v0/profile/address_validation': address.addressValidation,
  'GET /v0/mhv_account': mhvAcccount,
  'GET /v0/profile/personal_information': handleGetPersonalInformationRoute,
  'PUT /v0/profile/preferred_names': handlePutPreferredNameRoute,
  'PUT /v0/profile/gender_identities': handlePutGenderIdentitiesRoute,
  'GET /v0/profile/full_name': {
    data: {
      id: '',
      type: 'hashes',
      attributes: {
        first: 'Mitchell',
        middle: 'G',
        last: 'Jenkins',
        suffix: null,
      },
    },
  },
  'GET /v0/profile/ch33_bank_accounts': (_req, res) => {
    return res.status(200).json(bankAccounts.defaultResponse);
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
  'PUT /v0/profile/addresses': (req, res) => {
    if (
      req?.body?.id === address.homeAddressUpdateReceived.payload.id &&
      req?.body?.addressPou ===
        address.mailingAddressUpdateReceived.request.payload.addressPou
    ) {
      return res.json(
        _.set(
          address.mailingAddressUpdateReceived.response,
          'data.attributes.transactionId',
          'erroredId',
        ),
      );
    }

    if (
      req?.body?.addressPou ===
      address.mailingAddressUpdateReceived.request.payload.addressPou
    ) {
      return res.json(address.mailingAddressUpdateReceived.response);
    }

    return res.json(address.homeAddressUpdateReceived.response);
  },
  'POST /v0/profile/addresses': (req, res) => {
    return res.json(address.homeAddressUpdateReceived.response);
  },
  'GET /v0/profile/status/:id': (req, res) => {
    if (req?.params?.id === 'erroredId') {
      return res.json(
        _.set(status.failure, 'data.attributes.transactionId', req.params.id),
      );
    }

    return res.json(
      _.set(status.success, 'data.attributes.transactionId', req.params.id),
    );
  },
  'GET /v0/profile/communication_preferences': (_req, res) => {
    return res.json(createNotificationSuccess());
  },
};

module.exports = delay(responses, 2000);
