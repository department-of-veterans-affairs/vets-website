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
        veteranSocialSecurityNumber: '796123607',
        homePhone: '8015551217',
        mobilePhone: '6493315849',
        veteranAddress: {
          street: '419 LaPorte Ave',
          street2: 'Apt C',
          city: 'Fort Collins',
          state: 'CO',
          country: 'USA',
          postalCode: '80521',
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
