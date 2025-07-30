export const setClaimantSearch = () => {
  cy.intercept('/accredited_representative_portal/v0/claimant/search', {
    data: {
      firstName: 'Karol',
      lastName: 'Johnson',
      city: 'Eau Claire',
      state: 'WI',
      postalCode: '54701',
      representative: 'Good Representatives R Us',
      icnTemporaryIdentifier: '7e7fbda9-49db-4206-aedb-5e9783556d79',
      poaRequests: [
        {
          claimantId: '8bea4d28-da9f-43eb-836f-6d24b4bb5061',
          createdAt: '2025-03-26T12:53:17.249Z',
          expiresAt: '2025-05-26T12:53:17.249Z',
          powerOfAttorneyForm: {
            authorizations: {
              recordDisclosure: true,
              recordDisclosureLimitations: ['ALCOHOLISM', 'DRUG_ABUSE'],
              addressChange: false,
            },
            claimant: {
              name: {
                first: 'Karol',
                middle: null,
                last: 'Johnson',
              },
              address: {
                addressLine1: '99704 Emilie Shores',
                addressLine2: null,
                city: 'West Tanekaport',
                stateCode: 'OH',
                country: 'US',
                zipCode: '00013-5566',
                zipCodeSuffix: null,
              },
              ssn: '8682',
              vaFileNumber: '1360',
              dateOfBirth: '1928-01-16',
              serviceNumber: '343163173',
              serviceBranch: 'AIR_FORCE',
              phone: '7737145581',
              email: 'simon_mann@walsh.test',
            },
          },
          resolution: {
            createdAt: '2025-01-30T12:53:17.249Z',
            type: 'decision',
            decisionType: 'declination',
            declinationReason: "Didn't authorize treatment record disclosure",
            creatorId: '03e24c1f-1ef8-476b-80c0-532022b6b903',
            id: '810b554b-478d-42c7-8a5d-d98827add478',
          },
          accreditedIndividual: {
            fullName: 'Bob Representative',
            id: '10000',
          },
          powerOfAttorneyHolder: {
            type: 'veteran_service_organization',
            name: 'Trustworthy Organization',
            id: 'YHZ',
          },
        },
      ],
    },
  });
};

export const setEmptyClaimantSearch = () => {
  cy.intercept('/accredited_representative_portal/v0/claimant/search', {
    statusCode: 404,
  });
};
