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

// Helper to make sure that the "health care" info does or doesn't exist
export function healthCareInfoExists(exists) {
  const assertion = exists ? 'exist' : 'not.exist';
  cy.findByTestId('benefits-of-interest')
    .findByRole('heading', { name: /^health care$/i })
    .should(assertion);
}

// Helper to make sure that the "disability compensation" info does or doesn't exist
export function disabilityCompensationExists(exists) {
  const assertion = exists ? 'exist' : 'not.exist';
  cy.findByTestId('benefits-of-interest')
    .findByRole('heading', { name: /^disability compensation$/i })
    .should(assertion);
}

// Helper to make sure that the "education and training" info does or doesn't exist
export function educationBenefitExists(exists) {
  const assertion = exists ? 'exist' : 'not.exist';
  cy.findByTestId('benefits-of-interest')
    .findByRole('heading', { name: /^education and training$/i })
    .should(assertion);
}
