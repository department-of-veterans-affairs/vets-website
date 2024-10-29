const responses = {
  FORM_22_1990: {
    minimal: {
      formData: {
        veteranFullName: {
          first: 'Mitchell',
          middle: 'George',
          last: 'Jenkins',
        },
        gender: 'M',
        veteranDateOfBirth: '1956-07-10',
        veteranSocialSecurityNumber: '123456789',
        homePhone: '5558081234',
        mobilePhone: '5554044567',
        email: 'test@test.com',
        veteranAddress: {
          street: '1234 Fake St.',
          street2: 'Apt Z',
          city: 'Fort Collins',
          state: 'CO',
          country: 'USA',
          postalCode: '80521',
          isMilitary: false,
        },
        toursOfDuty: [
          {
            serviceBranch: 'Space Force',
            dateRange: {
              from: '2021-01-01',
              to: '2023-01-01',
            },
          },
        ],
      },
      metadata: {
        version: 0,
        prefill: true,
        returnUrl: '/applicant/information',
      },
    },
  },
};
module.exports = responses;
