const { MOCK_VA_APPOINTMENTS } = require('./MOCK_CC_APPOINTMENTS');
const { MOCK_CC_APPOINTMENTS } = require('./MOCK_CC_APPOINTMENTS');

const createAppointmentSuccess = type => {
  if (type === 'va') {
    return MOCK_VA_APPOINTMENTS;
  }
  if (type === 'cc') {
    return MOCK_CC_APPOINTMENTS;
  }

  return {};
};

module.exports = {
  createAppointmentSuccess,
};
