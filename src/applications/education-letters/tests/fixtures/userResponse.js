/* eslint-disable camelcase */
/* eslint-disable no-undef */
export const mebUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      account: {
        accountUuid: '777bfa-2cbb-98fc-zz-9231fbac',
      },
      profile: {
        signIn: {
          serviceName: CSP_IDS.DS_LOGON,
          accountType: '2',
          ssoe: false,
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        firstName: 'TERESSA',
        middleName: 'ESTEFANA',
        lastName: 'HARBER',
        gender: 'F',
        birthDate: '1985-01-01',
        // dateOfBirth: '1990-01-01',
        verified: true,
        authnContext: 'dslogon',
        multifactor: true,
        zip: '21076',
        lastSignedIn: '2022-05-18T22:02:02.188Z',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
      inProgressForms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
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
        birthDate: '19850101',
        familyName: 'Doe',
        gender: 'F',
        givenNames: ['Jane', 'E'],
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
        isCernerPatient: false,
        vaPatient: true,
        mhvAccountState: 'OK',
      },
    },
  },
  meta: { errors: null },
};
