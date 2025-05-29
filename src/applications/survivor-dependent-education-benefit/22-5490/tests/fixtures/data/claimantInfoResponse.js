export const claimantResponse = {
  data: {
    id: '',
    type: 'meb_api_dgi_automation_claimant_responses',
    attributes: {
      claimant: {
        claimantId: 300000000000001,
        suffix: 'Jr.',
        dateOfBirth: '1988-10-01',
        firstName: 'Teressa',
        lastName: 'Harber',
        middleName: 'Estefana',
        notificationMethod: 'text',
        contactInfo: {
          addressLine1: '23082 Xavier Union',
          addressLine2: 'Apt. 498',
          city: 'Lake Stephanville',
          zipcode: '40638-9651',
          emailAddress: 'fake@fake.com',
          addressType: 'DOMESTIC',
          mobilePhoneNumber: '5401113337',
          homePhoneNumber: '5401114448',
          countryCode: 'US',
          stateCode: 'KS',
        },
        preferredContact: null,
      },
      serviceData: [
        {
          branchOfService: 'Marine Corps',
          beginDate: '2009-01-01',
          endDate: '2019-12-01',
          characterOfService: 'Honorable',
          reasonForSeparation: 'Expiration Term Of Service',
          exclusionPeriods: [],
          trainingPeriods: [],
        },
      ],
      toeSponsors: {
        transferOfEntitlements: [
          {
            firstName: 'Sharon',
            lastName: 'Parker',
            sponsorRelationship: 'Spouse',
            sponsorVaId: 8009623331,
            dateOfBirth: '1985-05-10',
          },
          {
            firstName: 'Kathi',
            lastName: 'Parker',
            sponsorRelationship: 'Child',
            sponsorVaId: 8009623332,
            dateOfBirth: '1966-05-10',
          },
          {
            firstName: 'Rich',
            lastName: 'Crawford',
            sponsorRelationship: 'Child',
            sponsorVaId: 8009623333,
            dateOfBirth: '1966-05-10',
          },
        ],
      },
    },
  },
};
