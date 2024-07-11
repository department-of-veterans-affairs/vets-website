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

const cernerUser = {
  data: {
    attributes: {
      profile: {
        signIn: {
          serviceName: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        firstName: 'Cersei',
        middleName: '',
        lastName: 'Smith',
        gender: 'F',
        birthDate: '1985-01-01',
        verified: true,
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
          {
            facilityId: '757',
            isCerner: true,
          },
        ],
      },
    },
  },
  meta: { errors: null },
};

const generateUserWithFacilities = ({ facilities = [], name = 'Harry' }) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        profile: {
          ...defaultUser.data.attributes.profile,
          facilities,
          firstName: name,
        },
      },
    },
  };
};

const generateUserWithServiceProvider = ({ serviceProvider = 'idme' }) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        profile: {
          ...defaultUser.data.attributes.profile,
          signIn: {
            serviceName: serviceProvider,
          },
        },
      },
    },
  };
};

const generateUser = ({ serviceProvider = 'idme', facilities, loa = 3 }) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        vaProfile: {
          ...defaultUser.data.attributes.va_profile,
          facilities:
            facilities || defaultUser.data.attributes.va_profile.facilities,
        },
        profile: {
          ...defaultUser.data.attributes.profile,
          loa: { current: loa },
          signIn: {
            serviceName: serviceProvider,
          },
        },
      },
    },
  };
};

const noFacilityUser = generateUserWithFacilities({ facilities: [] });

module.exports = {
  defaultUser,
  cernerUser,
  noFacilityUser,
  generateUser,
  generateUserWithServiceProvider,
  generateUserWithFacilities,
};
