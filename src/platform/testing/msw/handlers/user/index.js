import { rest } from 'msw';

/**
 * Default authenticated user
 */
export const defaultUser = {
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
        'form526',
        'user-profile',
        'appeals-status',
        'id-card',
        'identity-proofed',
        'vet360',
        'evss_common_client',
        'claim_increase',
        'claim_increase',
        'lighthouse',
        'veteran-id-card',
        'health-records',
        'medical_copays',
        'medical_records',
        'messaging',
        'mhv_accounts_creation',
        'mhv_accounts_eligible_for_premium',
        'mhv_accounts_premium',
        'mhv_accounts_advanced',
        'prescriptions',
        'verified_user_profile',
        'vet360',
        'virtual-agent',
      ],
      account: {
        accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2',
      },
      profile: {
        email: 'vets.gov.user+36@gmail.com',
        firstName: 'JUDY',
        middleName: 'M',
        lastName: 'MORRISON',
        birthDate: '1953-04-01',
        gender: 'F',
        zip: '94611',
        lastSignedIn: '2024-01-01T12:00:00Z',
        loa: {
          current: 3,
        },
        multifactor: true,
        verified: true,
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19530401',
        familyName: 'Morrison',
        gender: 'F',
        givenNames: ['Judy', 'M'],
        isCernerPatient: false,
        facilities: [
          {
            facilityId: '983',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'OK',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
      },
      inProgressForms: [],
      prefillsAvailable: [],
    },
  },
  meta: {
    errors: null,
  },
};

/**
 * MSW handler for GET /v0/user
 */
export const userHandler = (userData = defaultUser) => {
  return rest.get('*/v0/user', (req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(userData));
  });
};

/**
 * MSW handler for personal information
 */
export const personalInformationHandler = (options = {}) => {
  return rest.get('*/v0/profile/personal_information', (req, res, ctx) => {
    return res(
      ctx.delay(options.delay ?? 300),
      ctx.json({
        data: {
          id: '',
          type: 'hashes',
          attributes: {
            preferredName: options.preferredName || 'Pat',
            genderIdentity: options.genderIdentity || null,
          },
        },
      }),
    );
  });
};

/**
 * Unauthenticated user (no MHV access)
 */
export const unauthenticatedUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [],
      account: {
        accountUuid: null,
      },
      profile: {
        email: null,
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        gender: null,
        zip: null,
        lastSignedIn: null,
        loa: {
          current: 1,
        },
        multifactor: false,
        verified: false,
      },
    },
  },
};
