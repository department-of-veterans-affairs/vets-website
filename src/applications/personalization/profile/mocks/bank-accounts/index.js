const defaultResponse = {
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

const errorResponse = {
  data: {
    errors: [{}],
  },
};

module.exports = {
  defaultResponse,
  errorResponse,
};
