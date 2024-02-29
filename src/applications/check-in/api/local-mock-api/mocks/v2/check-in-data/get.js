const { mockDemographics, defaultUUID } = require('../shared/get');

const createMockSuccessResponse = (
  data,
  hasBeenValidated,
  demographicsNeedsUpdate = false,
  demographicsConfirmedAt = null,
  nextOfKinNeedsUpdate = false,
  nextOfKinConfirmedAt = null,
  emergencyContactNeedsUpdate = false,
  emergencyContactConfirmedAt = null,
) => {
  const rv = {
    id: data.id || defaultUUID,
    payload: {
      demographics: {
        mailingAddress: mockDemographics.mailingAddress,
        homeAddress: mockDemographics.homeAddress,
        homePhone: mockDemographics.homePhone,
        mobilePhone: mockDemographics.mobilePhone,
        workPhone: mockDemographics.workPhone,
        emailAddress: mockDemographics,
      },
      appointments: [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'HEART CLINIC 1',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: '0001',
          stationNo: '0001',
        },
      ],
      patientDemographicsStatus: {
        demographicsNeedsUpdate,
        demographicsConfirmedAt,
        nextOfKinNeedsUpdate,
        nextOfKinConfirmedAt,
        emergencyContactNeedsUpdate,
        emergencyContactConfirmedAt,
      },
      setECheckinStartedCalled: true,
    },
  };
  if (hasBeenValidated) {
    rv.payload.appointments[0].startTime = '2021-08-19T13:56:31';
    rv.payload.appointments[0].eligibility = 'ELIGIBLE';
  }
  return rv;
};

module.exports = {
  createMockSuccessResponse,
};
