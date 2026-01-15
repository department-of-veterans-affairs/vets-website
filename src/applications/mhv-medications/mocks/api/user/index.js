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
  data: {
    id: '',
    type: 'user',
    attributes: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'form-save-in-progress',
        'form-prefill',
        'rx',
        'messaging',
        'medical-records',
        'health-records',
        'user-profile',
        'appeals-status',
        'identity-proofed',
        'vet360',
      ],
      account: {
        accountUuid: 'dcfcbb38-4879-4406-bfaf-2d86a62d9117',
      },
      profile: {
        email: 'marufsystb2allergy@id.me',
        firstName: 'Veteran',
        middleName: null,
        lastName: 'Maveteran',
        preferredName: 'Pat',
        birthDate: '1974-04-06',
        gender: 'M',
        zip: null,
        lastSignedIn: '2024-10-29T14:13:12.505Z',
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: 'idme',
          clientId: 'vaweb',
          authBroker: 'sis',
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        claims: {
          appeals: true,
          coe: false,
          communicationPreferences: true,
          connectedApps: true,
          medicalCopays: false,
          militaryHistory: false,
          paymentHistory: false,
          personalInformation: true,
          ratingInfo: false,
          form526RequiredIdentifierPresence: {
            participantId: false,
            birlsId: false,
            ssn: true,
            birthDate: true,
            edipi: false,
          },
        },
        icn: '1013884191V012082',
        birlsId: null,
        edipi: null,
        secId: '1013884191',
        logingovUuid: null,
        idmeUuid: 'fd8efa99032b46b98beabac7b831f012',
        idTheftFlag: false,
        initialSignIn: '2023-09-13T18:49:23.788Z',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19740406',
        familyName: 'Maveteran',
        gender: 'M',
        givenNames: ['Veteran'],
        isCernerPatient: false,
        cernerId: null,
        cernerFacilityIds: [],
        facilities: [
          {
            facilityId: '528',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'MULTIPLE',
        activeMHVIds: ['22461761', '22461761'],
        oh_migration_info: {
          user_at_pretransitioned_oh_facility: false,
          user_facility_ready_for_info_alert: false,
          user_facility_migrating_to_oh: true,
          migration_schedules: [],
        },
        ohMigrationInfo: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                {
                  facilityId: 528,
                  facilityName: 'Test VA Medical Center',
                },
                {
                  facilityId: 123,
                  facilityName: 'Different VA Medical Center',
                },
              ],
              phases: {
                current: 'p1',
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
      veteranStatus: null,
      inProgressForms: [],
      prefillsAvailable: [
        '21-686C',
        '40-10007',
        '0873',
        '22-1990',
        '22-1990N',
        '22-1990E',
        '22-1990EMEB',
        '22-1995',
        '22-5490',
        '22-5490E',
        '22-5495',
        '22-0993',
        '22-0994',
        'FEEDBACK-TOOL',
        '22-10203',
        '22-1990S',
        '22-1990EZ',
        '21-526EZ',
        '1010ez',
        '10-10EZR',
        '21P-530',
        '21P-527EZ',
        '21P-530EZ',
        '686C-674',
        '20-0995',
        '20-0996',
        '10182',
        'MDOT',
        '5655',
        '28-8832',
        '28-1900',
        '26-1880',
        '26-4555',
        '21-0966',
        '10-7959C',
        'FORM-UPLOAD-FLOW',
        '21-22',
        '21-22A',
        'FORM-MOCK-AE-DESIGN-PATTERNS',
      ],
      vet360ContactInformation: {
        vet360Id: '1513621',
        email: null,
        residentialAddress: null,
        mailingAddress: null,
        mobilePhone: null,
        homePhone: null,
        workPhone: null,
        temporaryPhone: null,
        faxNumber: null,
        textPermission: null,
      },
      session: {
        authBroker: 'sis',
        ssoe: false,
        transactionid: null,
      },
      onboarding: {
        show: null,
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
