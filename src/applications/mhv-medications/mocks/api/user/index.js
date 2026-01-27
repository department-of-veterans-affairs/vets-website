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
      account: {
        accountUuid: '6af59b36-f14d-482e-88b4-3d7820422343',
      },
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
        oh_migration_info: {
          user_at_pretransitioned_oh_facility: false,
          user_facility_ready_for_info_alert: false,
          user_facility_migrating_to_oh: false,
          migration_schedules: [],
        },
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
        isCernerPatient: true,
        cernerId: '1234567890',
        cernerFacilityIds: ['757'],
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
        oh_migration_info: {
          user_at_pretransitioned_oh_facility: true,
          user_facility_ready_for_info_alert: false,
          user_facility_migrating_to_oh: false,
          migration_schedules: [],
        },
      },
    },
  },
  meta: { errors: null },
};

const transitioningUser = {
  ...cernerUser,
  data: {
    ...cernerUser.data,
    attributes: {
      ...cernerUser.data.attributes,
      va_profile: {
        ...cernerUser.data.attributes.va_profile,
        oh_migration_info: {
          user_at_pretransitioned_oh_facility: false,
          user_facility_ready_for_info_alert: false,
          user_facility_migrating_to_oh: true,
          migration_schedules: [
            {
              migration_date: '2026-05-01',
              facilities: [
                {
                  facility_id: 528,
                  facility_name: 'Test VA Medical Center',
                },
                {
                  facility_id: 123,
                  facility_name: 'Different VA Medical Center',
                },
              ],
              phases: {
                current: 'p1', // All tools in warning alert phase
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026',
                p6: 'May 3, 2026',
                p7: 'May 8, 2026',
              },
            },
          ],
        },
      },
    },
  },
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
          first_name: name,
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

module.exports = {
  defaultUser,
  cernerUser,
  transitioningUser,
  noFacilityUser,
  generateUser,
  generateUserWithServiceProvider,
  generateUserWithFacilities,
};
