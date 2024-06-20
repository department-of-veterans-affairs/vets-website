export const veteranFormData = {
  data: {
    claimantAddress: {
      street: '123 Hanover Drive',
    },
    fullName: {
      first: 'Bob',
      middle: 'E',
      last: 'Leyland',
    },
    claimantEmailAddress: 'bob@example.com',
    claimantPhoneNumber: '555-222-1212',
    dateOfBirth: '12/29/1978',
    VAFileNumber: '1234567890',
    ssn: '1234567890',
    status: 'isActiveDuty',
  },
};

export const dependentFormData = {
  data: {
    claimantAddress: { street: '123 Hanover Drive' },
    claimantEmailAddress: 'robj@example.com',
    claimantPhoneNumber: '555-222-1212',
    dateOfBirth: '01/14/2003',
    VAFileNumber: '0123456789',
    fullName: { first: 'Robert', middle: 'James', last: 'Leyland' },
    veteranInformation: {
      fullName: {
        first: 'Bob',
        middle: 'E',
        last: 'Leyland',
      },
      ssn: '1234567890',
    },
    ssn: '0123456789',
    status: 'isChild',
  },
};
