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
        isEduClaimAvailable: true,
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
        name: 'BASE TEST - DIRECT DEPOSIT',
        accountType: 'Checking',
        accountNumber: '*******5487',
        routingNumber: '*****1533',
      },
      veteranStatus: 'VETERAN',
      // veteranStatus: 'DEPENDENT',
      // veteranStatus: 'NEITHER_VETERAN_NOR_DEPENDENT',
      // veteranStatus: 'COULD_NOT_DETERMINE_DUE_TO_EXCEPTION',
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
      code: 'direct.deposit.unspecified.error',
      status: 400,
      source: 'Lighthouse Direct Deposit',
    },
  ],
};

const createError = ({
  code = '',
  detail = '',
  title = '',
  status = '',
} = {}) => {
  const errorBase = _.cloneDeep(unspecifiedError);
  if (code) {
    _.set(errorBase, 'errors[0].code', code);
  }
  if (detail) {
    _.set(errorBase, 'errors[0].detail', detail);
  }
  if (title) {
    _.set(errorBase, 'errors[0].title', title);
  }
  if (status) {
    _.set(errorBase, 'errors[0].status', status);
  }
  return errorBase;
};

const errors = {
  unspecified: unspecifiedError,
  generic: createError({
    code: 'direct.deposit.generic.error',
  }),
  accountNumberFlagged: createError({
    code: 'direct.deposit.account.number.fraud',
  }),
  routingNumberFlagged: createError({
    code: 'direct.deposit.routing.number.fraud',
  }),
  invalidRoutingNumber: createError({
    code: 'direct.deposit.routing.number.invalid',
  }),
  invalidChecksumRoutingNumber: createError({
    code: 'direct.deposit.routing.number.invalid.checksum',
  }),
  invalidRoutingNumberUnspecified: createError({
    detail: 'No changes were made: Invalid Routing Number',
  }),
  invalidAccountNumber: createError({
    code: 'direct.deposit.account.number.invalid',
  }),
  paymentRestrictionsPresent: createError({
    code: 'direct.deposit.restriction.indicators.present',
  }),
  invalidDayPhone: createError({
    code: 'direct.deposit.day.phone.number.invalid',
  }),
  invalidDayPhoneArea: createError({
    code: 'direct.deposit.day.area.number.invalid',
  }),
  invalidNightPhone: createError({
    code: 'direct.deposit.night.phone.number.invalid',
  }),
  invalidNightPhoneArea: createError({
    code: 'direct.deposit.night.area.number.invalid',
  }),
  invalidMailingAddress: createError({
    code: 'direct.deposit.mailing.address.invalid',
  }),
  missingPaymentAddress: createError({
    title: 'Missing Required Data',
    detail: 'Payment Address Data Not Found',
    code: 'direct.deposit.payment.address.missing',
    status: 422,
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
      name: 'TEST UPDATE SUCCESS - DIRECT DEPOSIT',
      accountType: 'Checking',
      accountNumber: '******2222',
      routingNumber: '*****3333',
    }),
    errors,
  },
};
