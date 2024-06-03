const defaultUser = {
  data: {
    attributes: {
      profile: {
        signIn: {
          serviceName: 'idme',
          authBroker: 'iam',
          ssoe: true,
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        firstName: 'Gina',
        middleName: '',
        lastName: 'Doe',
        gender: 'F',
        birthDate: '1985-01-01',
        verified: true,
      },
      session: {
        authBroker: 'iam',
        ssoe: true,
        transactionid: 'sf8mUOpuAoxkx8uWxI6yrBAS/t0yrsjDKqktFz255P0=',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
      inProgressForms: [],
      prefillsAvailable: ['21-526EZ'],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'form526',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
      ],
      vaProfile: {
        status: 'OK',
        birthDate: '19511118',
        familyName: 'Hunter',
        gender: 'M',
        givenNames: ['Julio', 'E'],
        activeStatus: 'active',
        facilities: [
          {
            facilityId: '983',
            isCerner: false,
          },
          {
            facilityId: '984',
            isCerner: false,
          },
        ],
        mhvAccountState: 'OK',
      },
    },
  },
  meta: { errors: null },
};

module.exports = {
  defaultUser,
};
