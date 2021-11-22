const defaultUUID = '46bebc0a-b99c-464f-a5c5-560bc9eae287';

const createMockSuccessResponse = token => {
  const mockTime = new Date();
  return {
    id: token || defaultUUID,
    payload: {
      demographics: {
        nextOfKin1: {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        },
        mailingAddress: {
          street1: '123 Turtle Trail',
          street2: '',
          street3: '',
          city: 'Treetopper',
          state: 'Tennessee',
          zip: '101010',
        },
        homeAddress: {
          street1: '445 Fine Finch Fairway',
          street2: 'Apt 201',
          city: 'Fairfence',
          state: 'Florida',
          zip: '445545',
        },
        homePhone: '5552223333',
        mobilePhone: '5553334444',
        workPhone: '5554445555',
        emailAddress: 'kermit.frog@sesameenterprises.us',
      },
      appointments: [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: mockTime,
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: mockTime,
          checkInWindowEnd: mockTime,
          checkedInTime: '',
        },
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-other-ien',
          startTime: mockTime,
          eligibility: 'ELIGIBLE',
          facilityId: 'some-facility',
          checkInWindowStart: mockTime,
          checkInWindowEnd: mockTime,
          checkedInTime: '',
        },
      ],
    },
  };
};

const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = {
  createMockSuccessResponse,
  createMockFailedResponse,
  defaultUUID,
};
