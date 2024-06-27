/* eslint-disable camelcase */
const defaultUser = {
  data: {
    id: '',
    type: 'user_scaffolds',
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
        va_patient: true,
        mhv_account_state: 'OK',
      },
    },
  },
  meta: { errors: null },
};

const generateUser = ({
  serviceProvider = 'idme',
  loa = 3,
  mhvAccountState = 'OK',
  vaPatient = true,
} = {}) => {
  return {
    ...defaultUser,
    data: {
      ...defaultUser.data,
      attributes: {
        ...defaultUser.data.attributes,
        va_profile: {
          ...defaultUser.data.attributes.va_profile,
          mhv_account_state: mhvAccountState,
          va_patient: vaPatient,
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

module.exports = {
  defaultUser,
  generateUser,
};
