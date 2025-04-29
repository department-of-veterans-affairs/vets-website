const createMockSuccessResponse = _data => {
  return {
    data: {
      data: {
        attributes: {
          id: 1,
          patientDfn: '123',
          demographicsNeedsUpdate: false,
          demographicsConfirmedAt: '2022-01-22T12:00:00.000-05:00',
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: '2022-02-03T12:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2022-01-27T12:00:00.000-05:00',
          insuranceVerificationNeeded: null,
        },
        id: '123',
        type: 'PatientDemographicsStatusResponse',
      },
    },
  };
};

module.exports = { createMockSuccessResponse };
