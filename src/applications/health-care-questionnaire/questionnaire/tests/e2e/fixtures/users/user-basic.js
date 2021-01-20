import { mockContactInformation } from 'platform/user/profile/vap-svc/util/local-vapsvc.js';

const basicUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'form-save-in-progress',
        'form-prefill',
        'evss-claims',
        'add-person',
        'user-profile',
        'appeals-status',
        'identity-proofed',
      ],
      account: {
        accountUuid: '15bd1f95-4ada-4a86-b4a4-2a142a8d0310',
      },
      profile: {
        email: 'vets.gov.user+34@gmail.com',
        firstName: 'CALVIN',
        middleName: 'C',
        lastName: 'FLETCHER',
        birthDate: '1924-12-19',
        gender: 'M',
        zip: null,
        lastSignedIn: '2020-08-28T13:58:53.409Z',
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: 'idme',
          accountType: 'N/A',
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3/vets',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19241219',
        familyName: 'Fletcher',
        gender: 'M',
        givenNames: ['Calvin', 'Null'],
        isCernerPatient: false,
        facilities: [
          {
            facilityId: '648',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'NONE',
      },
      veteranStatus: null,
      inProgressForms: [],
      prefillsAvailable: [
        '21-686C',
        '40-10007',
        '22-1990',
        '22-1990N',
        '22-1990E',
        '22-1995',
        '22-1995S',
        '22-5490',
        '22-5495',
        '22-0993',
        '22-0994',
        'FEEDBACK-TOOL',
        '22-10203',
        '21-526EZ',
        '21-526EZ-BDD',
        '1010ez',
        '21P-530',
        '21P-527EZ',
        '686C-674',
        '20-0996',
        'MDOT',
      ],
      vet360ContactInformation: mockContactInformation,
    },
  },
  meta: {
    errors: [
      {
        externalService: 'EMIS',
        startTime: '2020-08-28T13:59:01Z',
        endTime: null,
        description:
          'IOError, Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/by_edipi/default.yml]., Betamocks default response requested but none exist. Please create one at: [/cache/emis/veteran_status/by_edipi/default.yml].',
        status: 503,
      },
    ],
  },
};

export default basicUser;
