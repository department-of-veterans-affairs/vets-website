const response = {
  formData: {
    fullName: {
      first: 'Mitchell',
      middle: 'George',
      last: 'Jenkins',
    },
    dateOfBirth: '1956-07-10',
    applicantAddress: {
      street: '123 Mailing Address St.',
      city: 'Fulton',
      state: 'NY',
      country: 'USA',
      postalCode: '97064',
    },
    contactPhone: '4445551212',
    contactEmail: 'test@test.com',
    periodsOfService: [
      {
        serviceBranch: 'Air Force',
        dateRange: {
          from: '2001-03-21',
          to: '2014-07-21',
        },
      },
      {
        serviceBranch: 'Marine Corps',
        dateRange: {
          from: '2015-06-27',
          to: '2018-07-11',
        },
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/applicant-information',
  },
};

module.exports = { response };
