export function mockLocalStorage() {
  // make sure no first-time UX modals are in the way
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro', 'find-benefits-intro']),
  );
}

// response from GET user/preferences when they have not made any selections
export const getUserPreferencesEmpty = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [],
    },
  },
};

// response from GET user/preferences when they have already made one selection
export const getUserPreferencesOneSelected = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title:
            'the benefits a veteran is interested in, so VA.gov can help you apply for them',
          userPreferences: [
            { code: 'health-care', description: 'Get health care coverage' },
          ],
        },
      ],
    },
  },
};

// response from GET user/preferences when they have already made two selections
export const getUserPreferencesTwoSelected = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title:
            'the benefits a veteran is interested in, so VA.gov can help you apply for them',
          userPreferences: [
            { code: 'health-care', description: 'Get health care coverage' },
            {
              code: 'disability',
              description:
                'Find benefits for an illness or injury related to a veterans service',
            },
          ],
        },
      ],
    },
  },
};

// response from GET /v0/user/preferences/choices/benefits
export const getPreferencesChoices = {
  data: {
    id: '1',
    type: 'preferences',
    attributes: {
      code: 'benefits',
      title:
        'the benefits a veteran is interested in, so VA.gov can help you apply for them',
      preferenceChoices: [
        { code: 'health-care', description: 'Get health care coverage' },
        {
          code: 'disability',
          description:
            'Find benefits for an illness or injury related to a veterans service',
        },
        {
          code: 'appeals',
          description:
            'Appeal the decision VA made on veterans disability claim',
        },
        {
          code: 'education-training',
          description:
            'GI Bill to help pay for college, training, or certification',
        },
        {
          code: 'careers-employment',
          description:
            'Find a job, build skills, or get support for my own business',
        },
        {
          code: 'pension',
          description:
            'Get financial support for veterans disability or for care related to aging',
        },
        {
          code: 'housing-assistance',
          description: 'Find, buy, build, modify, or refinance a place to live',
        },
        {
          code: 'life-insurance',
          description: 'Learn about veterans life insurance options',
        },
        {
          code: 'burials-memorials',
          description:
            'Apply for burial in a VA cemetery or for allowances to cover burial costs',
        },
        {
          code: 'family-caregiver-benefits',
          description: 'Learn about benefits for family members and caregivers',
        },
      ],
    },
  },
};

// response from POST user/preferences after they have made a single selection
export const addUserPreferences = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title:
            'the benefits a veteran is interested in, so VA.gov can help you apply for them',
          userPreferences: [
            { code: 'health-care', description: 'Get health care coverage' },
          ],
        },
      ],
    },
  },
};

// response from POST user/preferences after they have deleted a selection but still have selections remaining
export const removeSinglePreference = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title:
            'the benefits a veteran is interested in, so VA.gov can help you apply for them',
          userPreferences: [
            {
              code: 'disability',
              description:
                'Find benefits for an illness or injury related to a veterans service',
            },
          ],
        },
      ],
    },
  },
};

// response from DELETE /user/preferences/benefits/delete_all
export const deleteAllPreferences = {
  data: {
    id: '',
    type: 'hashes',
    attributes: { preferenceCode: 'benefits', userPreferences: [] },
  },
};

export function makeUserObject(options = {}) {
  const services = [];
  if (options.rx) {
    services.push('rx');
  }
  if (options.messaging) {
    services.push('messaging');
  }
  return {
    data: {
      id: '',
      type: 'users_scaffolds',
      attributes: {
        services,
        account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
        profile: {
          email: 'vets.gov.user+36@gmail.com',
          firstName: 'WESLEY',
          middleName: 'WATSON',
          lastName: 'FORD',
          birthDate: '1986-05-06',
          gender: 'M',
          zip: '21122-6706',
          lastSignedIn: '2020-07-21T00:04:51.589Z',
          loa: { current: 3, highest: 3 },
          multifactor: true,
          verified: true,
          signIn: { serviceName: 'idme', accountType: 'N/A', ssoe: true },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19860506',
          familyName: 'Ford',
          gender: 'M',
          givenNames: ['Wesley', 'Watson'],
          isCernerPatient: options.isCerner,
          facilities: options.facilities || [],
          vaPatient: options.isPatient,
          mhvAccountState: 'NONE',
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
          servedInMilitary: true,
        },
        inProgressForms: options.inProgressForms || [],
        prefillsAvailable: [],
        vet360ContactInformation: {},
      },
    },
    meta: { errors: null },
  };
}
