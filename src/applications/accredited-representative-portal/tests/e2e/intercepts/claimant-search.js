export const setClaimantSearch = () => {
  cy.intercept(
    '/accredited_representative_portal/v0/claimant/power_of_attorney_requests',
    [
      {
        claimantId: '8bea4d28-da9f-43eb-836f-6d24b4bb5061',
        createdAt: '2025-01-29T12:34:10.205Z',
        expiresAt: null,
        powerOfAttorneyForm: {
          authorizations: {
            recordDisclosure: false,
            recordDisclosureLimitations: ['HIV'],
            addressChange: true,
          },
          claimant: {
            name: {
              first: 'Karol',
              middle: null,
              last: 'Johnson',
            },
            address: {
              addressLine1: '210 Bernier Place',
              addressLine2: null,
              city: 'South Blanche',
              stateCode: 'MI',
              country: 'US',
              zipCode: '94878',
              zipCodeSuffix: null,
            },
            ssn: '5374',
            vaFileNumber: '5401',
            dateOfBirth: '1998-06-07',
            serviceNumber: '566059947',
            serviceBranch: 'NOAA',
            phone: '930-482-8663',
            email: 'fredrick@braun.test',
          },
        },
        resolution: {
          createdAt: '2025-01-30T12:34:09.205Z',
          type: 'decision',
          decisionType: 'declination',
          reason: "Didn't authorize treatment record disclosure",
          creatorId: '94c0a483-9e42-4035-856e-6c6a40b81f21',
          id: '9f7b16c7-c2e2-4286-8550-6c0bfdb72524',
        },
        accreditedIndividual: {
          fullName: 'Catheryn Baumbach',
          id: '10005',
        },
        powerOfAttorneyHolder: {
          type: 'veteran_service_organization',
          name: 'Good Representatives R Us',
          id: 'SVS',
        },
      },
    ],
  );
};

export const setEmptyClaimantSearch = () => {
  cy.intercept(
    '/accredited_representative_portal/v0/claimant/power_of_attorney_requests',
    [],
  );
};
