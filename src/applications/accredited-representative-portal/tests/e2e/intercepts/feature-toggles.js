export const setFeatureToggles = toggles => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        {
          name: 'accredited_representative_portal_frontend',
          value: toggles.isAppEnabled,
        },
        {
          name: 'accredited_representative_portal_pilot',
          value: toggles.isInPilot,
        },
      ],
    },
  });
};
