export const setIsAppEnabled = isAppEnabled => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        { name: 'accredited_representative_portal_frontend', isAppEnabled },
      ],
    },
  });
};

export const setIsInPilot = isInPilot => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        { name: 'accredited_representative_portal_pilot', value: isInPilot },
      ],
    },
  });
};
