const letters = {
  data: {
    attributes: {
      fullName: 'William Shakespeare',
      letters: [
        { name: 'Commissary Letter', letterType: 'commissary' },
        { name: 'Proof of Service Letter', letterType: 'proof_of_service' },
        {
          name: 'Service Verification Letter',
          letterType: 'service_verification',
        },
        { name: 'Benefit Summary Letter', letterType: 'benefit_summary' },
        {
          name: 'Benefit Verification Letter',
          letterType: 'benefit_verification',
        },
      ],
    },
  },
};

const benefitSummaryOptions = {
  data: {
    attributes: {
      benefitInformation: {
        awardEffectiveDate: '1965-01-01T05:00:00.000+00:00',
        hasAdaptedHousing: false,
        hasChapter35Eligibility: true,
        hasIndividualUnemployabilityGranted: false,
        hasNonServiceConnectedPension: false,
        hasServiceConnectedDisabilities: true,
        hasSpecialMonthlyCompensation: false,
        monthlyAwardAmount: 123,
        serviceConnectedPercentage: 2,
      },
      militaryService: [
        {
          branch: 'ARMY',
          characterOfService: 'HONORABLE',
          enteredDate: '1965-01-01T05:00:00.000+00:00',
          releasedDate: '1972-10-01T04:00:00.000+00:00',
        },
        {
          branch: 'ARMY',
          characterOfService: 'UNCHARACTERIZED_ENTRY_LEVEL',
          enteredDate: '1973-01-01T05:00:00.000+00:00',
          releasedDate: '1977-10-01T04:00:00.000+00:00',
        },
      ],
    },
  },
};

const address = {
  data: {
    attributes: {
      address: {
        addressEffectiveDate: '2012-04-03T04:00:00.000+00:00',
        addressOne: '57 COLUMBUS STRASSA',
        addressThree: '',
        addressTwo: 'BEN FRANKLIN VILLAGE',
        militaryPostOfficeTypeCode: 'APO',
        militaryStateCode: 'AE',
        type: 'MILITARY',
        zipCode: '09028',
        zipSuffix: '',
      },
      controlInformation: {
        canUpdate: true,
        corpAvailIndicator: true,
        corpRecFoundIndicator: true,
        hasNoBdnPaymentsIndicator: true,
        indentityIndicator: true,
        indexIndicator: true,
        isCompetentIndicator: true,
        noFiduciaryAssignedIndicator: true,
        notDeceasedIndicator: true,
      },
    },
  },
};
const newAddress = {
  data: {
    attributes: {
      address: {
        addressEffectiveDate: '2012-04-03T04:00:00.000+00:00',
        addressOne: '57 COLUMBUS STRASSA',
        addressThree: '',
        addressTwo: 'BEN FRANKLIN VILLAGE',
        city: 'Chicago',
        stateCode: 'IL',
        type: 'DOMESTIC',
        zipCode: '60602',
        zipSuffix: '',
      },
      controlInformation: {
        canUpdate: true,
        corpAvailIndicator: true,
        corpRecFoundIndicator: true,
        hasNoBdnPaymentsIndicator: true,
        indentityIndicator: true,
        indexIndicator: true,
        isCompetentIndicator: true,
        noFiduciaryAssignedIndicator: true,
        notDeceasedIndicator: true,
      },
    },
  },
};

const countries = {
  data: {
    attributes: {
      countries: ['Denmark', 'Sri Lanka', 'USA', 'United Kingdom'],
    },
  },
};

const states = {
  data: {
    attributes: {
      states: ['IL', 'MA', 'DC'],
    },
  },
};

const mockUserData = {
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
        'mhv-accounts',
        'evss-claims',
        'form526',
        'user-profile',
        'appeals-status',
        'id-card',
        'identity-proofed',
        'vet360',
        'evss_common_client',
        'claim_increase',
      ],
      account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
      profile: {
        email: 'vets.gov.user+36@gmail.com',
        firstName: 'Mike',
        middleName: '',
        lastName: 'Wazowski',
        birthDate: '2001-10-28',
        gender: 'M',
        zip: '94608',
        lastSignedIn: '2020-07-21T00:04:51.589Z',
        loa: { current: 3, highest: 3 },
        multifactor: true,
        verified: true,
        signIn: { serviceName: 'idme', accountType: 'N/A', ssoe: true },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
      },
      vaProfile: {
        status: 'OK',
        birthDate: '20011028',
        familyName: 'Wazowski',
        gender: 'M',
        givenNames: ['Michael', ''],
        facilities: [{ facilityId: '983', isCerner: false }],
        vaPatient: true,
        mhvAccountState: 'NONE',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
      inProgressForms: [],
      prefillsAvailable: [],
      vet360ContactInformation: {
        email: null,
        residentialAddress: {},
        mailingAddress: {
          addressLine1: '1200 Park Ave',
          addressLine2: 'c/o Pixar',
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Emeryville',
          countryName: 'United States',
          countryCodeIso2: 'US',
          countryCodeIso3: 'USA',
          countryCodeFips: null,
          countyCode: null,
          countyName: null,
          createdAt: '2020-05-30T03:57:20.000+00:00',
          effectiveEndDate: null,
          effectiveStartDate: '2020-07-10T20:10:45.000+00:00',
          id: 173917,
          internationalPostalCode: null,
          province: null,
          sourceDate: '2020-07-10T20:10:45.000+00:00',
          sourceSystemUser: null,
          stateCode: 'CA',
          transactionId: '7139aa82-fd06-45ea-a217-9654869924bd',
          updatedAt: '2020-07-10T20:10:46.000+00:00',
          validationKey: null,
          vet360Id: '1273780',
          zipCode: '94608',
          zipCodeSuffix: null,
        },
        homePhone: {
          areaCode: '510',
          countryCode: '1',
          createdAt: '2020-06-12T16:56:37.000+00:00',
          extension: '17477',
          effectiveEndDate: null,
          effectiveStartDate: '2020-07-14T19:07:45.000+00:00',
          id: 146766,
          isInternational: false,
          isTextable: null,
          isTextPermitted: null,
          isTty: null,
          isVoicemailable: null,
          phoneNumber: '9223000',
          phoneType: 'HOME',
          sourceDate: '2020-07-14T19:07:45.000+00:00',
          sourceSystemUser: null,
          transactionId: '92c49d39-22b2-4bd6-92b4-0b7e7c63c6a9',
          updatedAt: '2020-07-14T19:07:46.000+00:00',
          vet360Id: '1273780',
        },
        mobilePhone: {},
        workPhone: {},
        temporaryPhone: null,
        faxNumber: null,
        textPermission: null,
      },
    },
  },
  meta: { errors: null },
};

module.exports = {
  letters,
  benefitSummaryOptions,
  address,
  newAddress,
  countries,
  states,
  mockUserData,
};
