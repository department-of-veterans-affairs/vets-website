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
