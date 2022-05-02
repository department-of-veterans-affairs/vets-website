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

const createV2AppointmentSuccess = () => {
  return {
    data: [
      createVaosAppointment({ startsInDays: 1 }),
      createVaosAppointment({ startsInDays: 10 }),
      createVaosAppointment({ startsInDays: 30 }),
    ],
  };
};

module.exports = {
  v0: { createAppointmentSuccess },
  v2: { createAppointmentSuccess: createV2AppointmentSuccess, createVaosError },
};
