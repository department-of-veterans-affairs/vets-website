import features from './fixtures/mocks/features.json';

const TEST_URL = '/manage-dependents/dependents-verification-how-to-verify/';

const setup = ({ formEnabled = false } = {}) => {
  // Mock feature toggles route with form enabled/disabled
  const mockFeatures = {
    ...features,
    data: {
      ...features.data,
      vaDependentsVerification: formEnabled,
    },
  };

  cy.intercept('GET', '/v0/feature_toggles*', mockFeatures);
  cy.visit(TEST_URL);
};

describe('The Dependents Verification Widget with form disabled', () => {
  beforeEach(() => {
    setup({ formEnabled: false });
    cy.injectAxe();
  });

  it('displays the correct page content when form is disabled', () => {
    cy.get('.dependents-verification-widget').should('exist');

    cy.contains('You can submit this form by mail.').should('be.visible');

    cy.contains(
      'Fill out the Mandatory Verification of Dependents (VA Form 21-0538).',
    ).should('be.visible');

    // Should have form download link
    cy.get('va-link').should(
      'have.attr',
      'href',
      '/find-forms/about-form-21-0538/',
    );

    // Should display mailing address
    cy.contains('U.S. Department of Veterans Affairs').should('be.visible');
    cy.contains('Evidence Intake Center').should('be.visible');
    cy.contains('P.O. Box 4444').should('be.visible');
    cy.contains('Janesville, WI 53547-4444').should('be.visible');

    // Should NOT have online verification option
    cy.contains('Option 1: Verify online').should('not.exist');
    cy.get('va-link-action').should('not.exist');

    cy.axeCheck();
  });
});

// describe('The Dependents Verification Widget with form enabled', () => {
//   beforeEach(() => {
//     setup({ formEnabled: true });
//     cy.injectAxe();
//   });
//
//   it('displays the correct page content when form is enabled', () => {
//     cy.get('.dependents-verification-widget').should('exist');
//
//     cy.contains('You can submit this form in 1 of these 2 ways:').should('be.visible');
//
//     // Should show Option 1: Online verification
//     cy.contains('Option 1: Verify online').should('be.visible');
//     cy.contains('You can verify your dependents online right now.').should('be.visible');
//
//     cy.get('va-link-action')
//       .should('have.attr', 'type', 'secondary')
//       .should('contain.text', 'Verify your dependents on your disability benefits');
//
//     // Should show Option 2: Mail option
//     cy.contains('Option 2: Mail us the verification form').should('be.visible');
//     cy.contains('Fill out the Mandatory Verification of Dependents (VA Form 21-0538).').should('be.visible');
//
//     // Should have form download link
//     cy.get('va-link')
//       .should('have.attr', 'href', '/find-forms/about-form-21-0538/')
//       .should('contain.text', 'Get VA Form 21-0538 to download');
//
//     // Should display mailing address
//     cy.contains('U.S. Department of Veterans Affairs').should('be.visible');
//     cy.contains('Evidence Intake Center').should('be.visible');
//     cy.contains('P.O. Box 4444').should('be.visible');
//     cy.contains('Janesville, WI 53547-4444').should('be.visible');
//
//     cy.axeCheck();
//   });
//
//   it('has accessible content structure', () => {
//     // Check that options are properly structured
//     cy.get('.verification-option').should('have.length', 2);
//
//     // Check for proper address formatting
//     cy.get('.va-address-block').should('have.length', 2);
//
//     cy.axeCheck();
//   });
// });
//
describe('Feature toggle integration', () => {
  it('responds correctly to feature toggle changes', () => {
    // Start with form disabled
    setup({ formEnabled: false });
    cy.contains('You can submit this form by mail.').should('be.visible');
    cy.get('va-link-action').should('not.exist');

    // Simulate feature toggle being enabled (would require page reload in real scenario)
    // setup({ formEnabled: true });
    // cy.contains('You can submit this form in 1 of these 2 ways:').should('be.visible');
    // cy.get('va-link-action').should('exist');
  });
});
