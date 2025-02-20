const featureToggles = {
  data: {
    type: 'feature_toggles',
    features: [{ name: 'showDigitalForm1095b', value: true }],
  },
};

const form = {
  availableForms: [
    {
      year: 2021,
      lastUpdated: '2022-08-03T20:38:29.382Z',
    },
  ],
};

const formUnavailable = {
  availableForms: [],
};

const defaultUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      account: {
        accountUuid: '278bb426-e69b-49ec-a7e8-a1b8db3ddd44',
      },
      profile: {
        email: 'vets.gov.user+81@gmail.com',
        firstName: 'TRAVIS',
        middleName: 'D',
        lastName: 'JONES',
        birthDate: '1950-09-06',
        gender: 'M',
        zip: '44102',
        lastSignedIn: '2021-11-30T15:31:09.659Z',
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
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19510710',
        familyName: 'Jones',
        gender: 'M',
        givenNames: ['Travis', 'Null'],
        isCernerPatient: false,
        facilities: [],
        vaPatient: false,
        mhvAccountState: 'OK',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: false,
        servedInMilitary: false,
      },
      session: {
        ssoe: true,
        transactionid: 'G5RGEHXsNRo3Fwccav2RENSgPs9cffXNr2wvsmPa8AQ=',
      },
    },
  },
  meta: {
    errors: null,
  },
};

module.exports = {
  defaultUser,
  featureToggles,
  form,
  formUnavailable,
};
