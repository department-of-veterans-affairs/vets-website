const generateCoeEligibleResponse = (referenceNumber = '17923279') => ({
  data: {
    attributes: {
      determinationDate: '2022-06-01T00:00:00.00Z',
      referenceNumber,
      status: 'ELIGIBLE',
    },
  },
});

const generateCoeEmptyResponse = () => ({
  data: {
    attributes: {},
  },
});

module.exports = {
  generateCoeEligibleResponse,
  generateCoeEmptyResponse,
};
