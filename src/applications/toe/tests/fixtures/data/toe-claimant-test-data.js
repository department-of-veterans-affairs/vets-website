export const toeClaimantTestData = {
  data: {
    id: '',
    type: 'meb_api_dgi_automation_claimant_responses',
    attributes: {
      claimant: {
        claimantId: 300000000000001,
        suffix: 'Jr.',
        dateOfBirth: '1985-01-01',
        firstName: 'Teressa',
        lastName: 'Harber',
        middleName: 'Estefana',
        notificationMethod: 'TEXT',
        contactInfo: {
          addressLine1: '23082 Xavier Union',
          addressLine2: 'Apt. 498',
          city: 'Lake Stephanville',
          zipcode: '40638-9651',
          emailAddress: null,
          addressType: 'DOMESTIC',
          mobilePhoneNumber: '5401113337',
          homePhoneNumber: '5401114448',
          countryCode: 'US',
          stateCode: 'KS',
        },
        preferredContact: null,
      },
      serviceData: null,
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
