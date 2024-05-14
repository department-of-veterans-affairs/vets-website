/* eslint-disable camelcase */
const defaultUser = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
          auth_broker: 'iam',
          ssoe: true,
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Gina',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      session: {
        auth_broker: 'iam',
        ssoe: true,
        transactionid: 'sf8mUOpuAoxkx8uWxI6yrBAS/t0yrsjDKqktFz255P0=',
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [],
      prefills_available: ['21-526EZ'],
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
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
        facilities: [
          {
            facility_id: '983',
            is_cerner: false,
          },
          {
            facility_id: '984',
            is_cerner: false,
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
        sign_in: {
          service_name: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Cersei',
        middle_name: '',
        last_name: 'Smith',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [],
      prefills_available: ['21-526EZ'],
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
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
        facilities: [
          {
            facility_id: '983',
            is_cerner: false,
          },
          {
            facility_id: '984',
            is_cerner: false,
          },
          {
            facility_id: '757',
            is_cerner: true,
          },
        ],
        mhvAccountState: 'OK',
      },
    },
  },
  meta: { errors: null },
};

const generateUserWithFacilities = ({
  facilities = [],
  name = 'Harry',
} = {}) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        profile: {
          ...defaultUser.data.attributes.profile,
          facilities,
          first_name: name,
        },
        va_profile: {
          ...defaultUser.data.attributes.va_profile,
          mhvAccountState: 'OK',
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
          sign_in: {
            service_name: serviceProvider,
          },
        },
        va_profile: {
          ...defaultUser.data.attributes.va_profile,
          mhvAccountState: 'OK',
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
        va_profile: {
          ...defaultUser.data.attributes.va_profile,
          facilities:
            facilities || defaultUser.data.attributes.va_profile.facilities,
          mhvAccountState: 'OK',
        },
        profile: {
          ...defaultUser.data.attributes.profile,
          loa: { current: loa },
          sign_in: {
            service_name: serviceProvider,
          },
        },
      },
    },
  };
};

const noFacilityUser = generateUserWithFacilities({ facilities: [] });

const hasMHVAccount = {
  ...defaultUser,
  data: {
    ...defaultUser.data,
    attributes: {
      ...defaultUser.data.attributes,
      profile: {
        ...defaultUser.data.attributes.profile,
      },
      va_profile: {
        ...defaultUser.data.attributes.va_profile,
        mhvAccountState: 'OK',
      },
    },
  },
};

const noMHVAccount = {
  ...defaultUser,
  data: {
    ...defaultUser.data,
    attributes: {
      ...defaultUser.data.attributes,
      profile: {
        ...defaultUser.data.attributes.profile,
      },
      va_profile: {
        ...defaultUser.data.attributes.va_profile,
        mhvAccountState: 'NONE',
      },
    },
  },
};

const generateUserWithMHVAccountState = ({ mhvAccountState = 'OK' }) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        profile: {
          ...defaultUser.data.attributes.profile,
        },
        va_profile: {
          ...defaultUser.data.attributes.va_profile,
          mhvAccountState,
        },
      },
    },
  };
};

module.exports = {
  defaultUser,
  cernerUser,
  noFacilityUser,
  generateUser,
  generateUserWithServiceProvider,
  generateUserWithFacilities,
  hasMHVAccount,
  noMHVAccount,
  generateUserWithMHVAccountState,
};
