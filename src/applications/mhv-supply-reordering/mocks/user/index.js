/* eslint-disable camelcase */
const ok = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
          auth_broker: 'iam',
          ssoe: true,
        },
        email: 'vets.gov.user+1@gmail.com',
        loa: { current: 3 },
        first_name: 'Greg',
        middle_name: '',
        last_name: 'Anderson',
        gender: 'F',
        birth_date: '1933-04-05',
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
      prefills_available: ['21-526EZ', 'MDOT'],
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
        birth_date: '19330405',
        family_name: 'Anderson',
        gender: 'M',
        given_names: ['Greg', ''],
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
      },
    },
  },
  meta: { errors: null },
};

module.exports = {
  'GET /v0/user': ok,
};
