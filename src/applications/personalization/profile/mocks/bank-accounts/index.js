const noAccount = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      accountType: null,
      accountNumber: null,
      financialInstitutionRoutingNumber: null,
      financialInstitutionName: null,
    },
  },
};

const anAccount = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      accountType: 'Checking',
      accountNumber: '********2168',
      financialInstitutionRoutingNumber: '*****2084',
      financialInstitutionName: 'BANK OF AMERICA N.A.',
    },
  },
};
const errorResponse = {
  data: {
    errors: [{}],
  },
};
const saveSuccess = {
  data: {
    id: '',
    type: 'hashes',
    attributes: {
      accountType: 'Checking',
      accountNumber: '******1234',
      financialInstitutionRoutingNumber: '*****0021',
      financialInstitutionName: 'JPMORGAN CHASE BANK, NA',
    },
  },
};

module.exports = {
  noAccount,
  anAccount,
  saved: {
    success: saveSuccess,
  },
  errorResponse,
};
