// src/applications/my-education-benefits/tests/fixtures/data/prefill-transformer-test-data.js

export const claimantInfo = {
  data: {
    formData: {
      data: {
        id: '123',
        type: 'myEduClaim',
        attributes: {
          claimant: {
            claimantId: '1000000000000246',
            contactInfo: {
              addressLine1: '987 Real Rd.',
              addressLine2: 'Unit B',
              city: 'Realtown',
              stateCode: 'ZZ',
              zipCode: '99999',
              countryCodeIso3: 'USA',
              addressType: 'DOMESTIC',
              mobilePhoneNumber: '555-888-9999',
              homePhoneNumber: '555-999-1111',
              emailAddress: 'claimant@example.com',
            },
          },
        },
      },
    },
  },
};

export const mockDomesticUserState = {
  user: {
    profile: {
      vapContactInfo: {
        mailingAddress: {
          addressLine1: '170 Colorado Dr',
          addressType: 'DOMESTIC',
          countryCodeIso3: 'USA',
          city: 'Milwaukee',
          stateCode: 'WI',
          zipCode: '53202',
        },
      },
    },
  },
};

export const mockInternationalAddressUserState = {
  user: {
    profile: {
      vapContactInfo: {
        mailingAddress: {
          addressLine1: 'Calle de Alcalá',
          addressType: 'INTERNATIONAL',
          countryCodeIso3: 'ESP',
          city: 'Madrid',
          province: 'Comunidad De Madrid',
          internationalPostalCode: '28014',
        },
      },
    },
  },
};

/**
 * New mock with a multi-line VAP address that conflicts with claimant’s data.
 * All addresses here are FAKE to avoid PII.
 */
export const mockConflictingVapUserState = {
  user: {
    profile: {
      vapContactInfo: {
        mailingAddress: {
          addressLine1: '123 Fake St.',
          addressLine2: 'Apt. 456',
          city: 'Fakeville',
          stateCode: 'FA',
          zipCode: '12345',
          countryCodeIso3: 'USA',
          addressType: 'DOMESTIC',
        },
      },
    },
  },
};
