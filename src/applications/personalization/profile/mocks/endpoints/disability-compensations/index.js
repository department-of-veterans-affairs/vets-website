/* eslint-disable camelcase */
const _ = require('lodash');

const setInstitutionName = (obj, name) =>
  _.set(obj, 'data.attributes.paymentAccount.name', name);

const base = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      controlInformation: {
        canUpdateDirectDeposit: true,
        isCorpAvailable: true,
        isCorpRecFound: true,
        hasNoBdnPayments: true,
        hasIdentity: true,
        hasIndex: true,
        isCompetent: true,
        hasMailingAddress: true,
        hasNoFiduciaryAssigned: true,
        isNotDeceased: true,
        hasPaymentAddress: true,
      },
      paymentAccount: {
        name: 'BASE TEST - DISABILITY COMPENSATIONS',
        accountType: 'CHECKING',
        accountNumber: '*******5487',
        routingNumber: '*****1533',
      },
    },
  },
};

const isNotCompetent = _.set(
  _.cloneDeep(base),
  'data.attributes.controlInformation.isCompetent',
  false,
);
setInstitutionName(
  isNotCompetent,
  'TEST NOT COMPETENT FLAG - DISABILITY COMPENSATIONS',
);

const isFiduciary = _.set(
  _.cloneDeep(base),
  'data.attributes.controlInformation.hasNoFiduciaryAssigned',
  false,
);
setInstitutionName(
  isFiduciary,
  'TEST FIDUCIARY FLAG - DISABILITY COMPENSATIONS',
);

const isDeceased = _.set(
  _.cloneDeep(base),
  'data.attributes.controlInformation.isNotDeceased',
  false,
);
setInstitutionName(isDeceased, 'TEST DECEASED FLAG - DISABILITY COMPENSATIONS');

const isEligible = _.set(_.cloneDeep(base), 'data.attributes.paymentAccount', {
  name: null,
  accountType: null,
  accountNumber: null,
  routingNumber: null,
});

const isNotEligible = _.set(
  _.cloneDeep(isEligible),
  'data.attributes.controlInformation.canUpdateDirectDeposit',
  false,
);

// used as the base for other errors via createError
const unspecifiedError = {
  errors: [
    {
      title: 'Bad Request',
      detail: 'Unspecified Error Detail',
      code: 'cnp.payment.unspecified.error',
      status: 400,
      source: 'Lighthouse Direct Deposit',
    },
  ],
};

const createError = ({ code = '', detail = '' } = {}) => {
  const errorBase = _.cloneDeep(unspecifiedError);
  if (code) {
    _.set(errorBase, 'errors[0].code', code);
  }
  if (detail) {
    _.set(errorBase, 'errors[0].detail', detail);
  }
  return errorBase;
};

const errors = {
  unspecified: unspecifiedError,
  generic: createError({
    code: 'cnp.payment.generic.error',
  }),
  accountNumberFlagged: createError({
    code: 'cnp.payment.account.number.fraud',
  }),
  routingNumberFlagged: createError({
    code: 'cnp.payment.routing.number.fraud',
  }),
  invalidRoutingNumber: createError({
    code: 'cnp.payment.routing.number.invalid',
  }),
  invalidChecksumRoutingNumber: createError({
    code: 'cnp.payment.routing.number.invalid.checksum',
  }),
  invalidRoutingNumberUnspecified: createError({
    detail: 'No changes were made: Invalid Routing Number',
  }),
  invalidAccountNumber: createError({
    code: 'cnp.payment.account.number.invalid',
  }),
  paymentRestrictionsPresent: createError({
    code: 'cnp.payment.restriction.indicators.present',
  }),
  invalidDayPhone: createError({
    code: 'cnp.payment.day.phone.number.invalid',
  }),
  invalidDayPhoneArea: createError({
    code: 'cnp.payment.day.area.number.invalid',
  }),
  invalidNightPhone: createError({
    code: 'cnp.payment.night.phone.number.invalid',
  }),
  invalidNightPhoneArea: createError({
    code: 'cnp.payment.night.area.number.invalid',
  }),
  invalidMailingAddress: createError({
    code: 'cnp.payment.mailing.address.invalid',
  }),
};

module.exports = {
  base,
  isDeceased,
  isFiduciary,
  isNotCompetent,
  isEligible,
  isNotEligible,
  updates: {
    success: _.set(_.cloneDeep(base), 'data.attributes.paymentAccount', {
      name: 'TEST UPDATE SUCCESS - DISABILITY COMPENSATIONS',
      accountType: 'Checking',
      accountNumber: '******2222',
      routingNumber: '*****3333',
    }),
    errors,
  },
};
