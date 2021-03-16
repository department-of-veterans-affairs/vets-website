export const mockFeatureToggles = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: '/v0/feature_toggles*',
    response: {
      data: {
        features: [
          {
            name: 'dashboard_show_dashboard_2',
            value: true,
          },
        ],
      },
    },
  });
};
