const needsTermsAccepted = {
  data: {
    id: '',
    type: 'mhv_accounts',
    attributes: {
      accountLevel: null,
      accountState: 'needs_terms_acceptance',
      termsAndConditionsAccepted: false,
    },
  },
};

const hasAcceptedTerms = {
  data: {
    id: '',
    type: 'mhv_accounts',
    attributes: {
      accountLevel: null,
      accountState: 'no_account',
      termsAndConditionsAccepted: true,
    },
  },
};

const needsPatient = {
  data: {
    id: '',
    type: 'mhv_accounts',
    attributes: {
      accountLevel: null,
      accountState: 'needs_va_patient',
      termsAndConditionsAccepted: false,
    },
  },
};

module.exports = {
  needsPatient,
  needsTermsAccepted,
  hasAcceptedTerms,
};
