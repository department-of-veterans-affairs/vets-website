const response = {
  formData: {
    nonPrefill: {
      veteranSsnLastFour: '1234',
      veteranVaFileNumberLastFour: '5678',
    },
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
};

module.exports = response;
