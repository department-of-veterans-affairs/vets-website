const singleAppointment = [
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    clinicStopCodeName: 'Mental health',
    clinicLocation: 'SECOND FLOOR ROOM 2',
    doctorName: 'Dr. Jones',
    appointmentIen: 'some-ien',
    startTime: '2022-01-03T14:56:04.788Z',
    stationNo: '0001',
    eligibility: 'ELIGIBLE',
    kind: 'clinic',
    clinicIen: '0001',
    checkInWindowStart: '2022-01-03T14:56:04.788Z',
    checkInWindowEnd: '2022-01-03T14:56:04.788Z',
    checkInSteps: [],
    checkedInTime: '',
    status: '',
    facilityAddress: {
      zip: '92357-1000',
      street1: '11201 Benton Street',
      state: 'CA',
      street2: null,
      street3: null,
      city: 'Loma Linda',
    },
  },
];

const multipleAppointments = [
  {
    ...singleAppointment[0],
  },
  {
    ...singleAppointment[0],
    appointmentIen: 'some-ien2',
  },
  {
    ...singleAppointment[0],
    appointmentIen: 'some-other-ien',
  },
  {
    ...singleAppointment[0],
    appointmentIen: 'cvt-ien',
  },
  {
    ...singleAppointment[0],
    appointmentIen: 'vvc-ien',
  },
];

module.exports = { singleAppointment, multipleAppointments };
