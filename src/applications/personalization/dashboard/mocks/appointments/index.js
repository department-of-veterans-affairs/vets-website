const { MOCK_VA_APPOINTMENTS } = require('./MOCK_VA_APPOINTMENTS');
const { MOCK_CC_APPOINTMENTS } = require('./MOCK_CC_APPOINTMENTS');

const { createVaosAppointment, createVaosError } = require('./vaos-v2');

const createAppointmentSuccess = type => {
  if (type === 'va') {
    return MOCK_VA_APPOINTMENTS;
  }
  if (type === 'cc') {
    return MOCK_CC_APPOINTMENTS;
  }

  return {};
};

const createV2AppointmentSuccess = ({
  startsInDays = [1, 10, 30, 50],
} = {}) => {
  return {
    data: [
      ...startsInDays.map(days =>
        createVaosAppointment({ startsInDays: days }),
      ),
    ],
  };
};

module.exports = {
  v0: { createAppointmentSuccess },
  v2: { createAppointmentSuccess: createV2AppointmentSuccess, createVaosError },
};
