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

const notEnrolled = _.set(_.cloneDeep(base), 'data.attributes.paymentAccount', {
  name: null,
  accountType: null,
  accountNumber: null,
  routingNumber: null,
});

const errors = {
  invalidRoutingNumber: {
    errors: [
      {
        title: 'Bad Request',
        detail: 'Invalid routing number checksum. ',
        code: 'payment.accountRoutingNumber.invalidCheckSum',
        status: 400,
        source: 'Lighthouse Direct Deposit',
      },
    ],
  },
};

module.exports = {
  base,
  errors,
  isDeceased,
  isFiduciary,
  isNotCompetent,
  notEnrolled,
  updates: {
    success: _.set(_.cloneDeep(base), 'data.attributes.paymentAccount', {
      name: 'TEST UPDATE SUCCESS - DISABILITY COMPENSATIONS',
      accountType: 'Checking',
      accountNumber: '******2222',
      routingNumber: '*****3333',
    }),
  },
};
