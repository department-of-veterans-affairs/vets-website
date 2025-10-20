export const setFeatureToggles = toggles => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'accredited_representative_portal_frontend',
          value: toggles.isAppEnabled,
        },
        {
          name: 'accredited_representative_portal_pilot',
          value: toggles.isInPilot,
        },
        {
          name: 'accredited_representative_portal_form_526ez',
          value: toggles.is526ezEnabled,
        },
      ],
    },
  });
};
