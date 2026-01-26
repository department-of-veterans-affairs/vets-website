/* eslint-disable camelcase */
const defaultUser = {
  data: {
    id: '',
    type: 'user_scaffolds',
    attributes: {
      account: {
        account_uuid: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
      },
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
        preferred_Name: 'Ginny',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
        edipi: null,
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
        userAtPretransitionedOhFacility: false,
        userFacilityReadyForInfoAlert: false,
      },
    },
  },
  meta: { errors: null },
};

const generateUser = ({
  serviceName = 'idme',
  loa = 3,
  mhvAccountState = 'OK',
  vaPatient = true,
  oracleHealth = false,
  firstName = 'Gina',
  preferredName = 'Ginny',
  edipi = null,
} = {}) => {
  const facilities = defaultUser.data.attributes.va_profile.facilities.map(
    facility => ({ ...facility, is_cerner: oracleHealth }),
  );
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
          facilities,
          userAtPretransitionedOhFacility: oracleHealth,
          userFacilityReadyForInfoAlert: oracleHealth,
        },
        profile: {
          ...defaultUser.data.attributes.profile,
          first_name: firstName,
          preferred_Name: preferredName,
          loa: { current: loa },
          sign_in: {
            service_name: serviceName,
          },
          edipi,
        },
        vet360_contact_information: {
          email: {
            id: 12345,
            confirmation_date: null,
            updated_at: '2024-01-01T12:00:00.000+00:00',
            email_address: 'vet@va.gov',
          },
        },
      },
    },
  };
};

const CSP_IDS = {
  MHV: 'mhv',
  ID_ME: 'idme',
  DS_LOGON: 'dslogon',
  LOGIN_GOV: 'logingov',
};

const USER_MOCKS = Object.freeze({
  ALL_CAPS_NAME: generateUser({ firstName: 'KEVIN', preferredName: '' }),
  UNREGISTERED: generateUser({ loa: 3, vaPatient: false, edipi: '2116564958' }),
  UNREGISTERED_NO_EDIPI: generateUser({
    loa: 3,
    vaPatient: false,
    edipi: null,
  }),
  UNREGISTERED_NO_MHV: generateUser({
    loa: 3,
    vaPatient: false,
    edipi: '2116564958',
    mhvAccountState: 'NONE',
  }),
  UNVERIFIED: generateUser({ loa: 1, vaPatient: false }),
  LOGIN_GOV_UNVERIFIED: generateUser({
    loa: 1,
    serviceName: CSP_IDS.LOGIN_GOV,
  }),
  DS_LOGON_UNVERIFIED: generateUser({ loa: 1, serviceName: CSP_IDS.DS_LOGON }),
  NO_MHV_ACCOUNT: generateUser({ mhvAccountState: 'NONE' }),
  MHV_BASIC_ACCOUNT: generateUser({ loa: 1, serviceName: CSP_IDS.MHV }),
  DEFAULT: generateUser(),
  ORACLE_HEALTH_USER: generateUser({ oracleHealth: true }),
});

module.exports = {
  generateUser,
  USER_MOCKS,
};
