export function mockLocalStorage() {
  // make sure no first-time UX modals are in the way
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro', 'find-benefits-intro']),
  );
}

export const enrollmentStatusEnrolled = {
  applicationDate: '2006-01-30T00:00:00.000-06:00',
  enrollmentDate: '2006-03-20T00:00:00.000-06:00',
  preferredFacility: '626A4 - ALVIN C. YORK VAMC',
  effectiveDate: '2018-04-28T18:21:56.000-05:00',
  parsedStatus: 'enrolled',
};

export const enrollmentStatusNotEnrolled = {
  parsedStatus: 'none_of_the_above',
};

export const userPreferences = {
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

export const userPreferencesEmpty = {
  data: {
    id: '',
    type: 'arrays',
    attributes: {
      userPreferences: [],
    },
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
