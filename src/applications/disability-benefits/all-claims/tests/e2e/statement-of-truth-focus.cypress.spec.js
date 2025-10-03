describe('Statement of Truth Focus Management', () => {
  beforeEach(() => {
    // Mock feature toggles and API responses
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        features: [
          { name: 'disability_526_toxic_exposure', value: true },
          { name: 'show_financial_status_report_wizard', value: true },
        ],
      },
    });

    cy.intercept('POST', '/v0/disability_compensation_form/submit_all_claim', {
      status: 200,
      body: {
        data: {
          attributes: {
            confirmationNumber: 'TEST123456',
            submittedAt: '2023-10-03T12:00:00Z',
          },
        },
      },
    });

    // Enable shadow DOM for web component testing
    cy.config('includeShadowDom', true);
  });

  it('should focus on correct field when validation errors occur', () => {
    cy.visit(
      '/disability/file-disability-claim-form-21-526ez/review-and-submit',
    );

    cy.injectAxeThenAxeCheck();

    // Test the focus behavior directly on the review page
    cy.get('va-statement-of-truth').then($element => {
      // Test incorrect signature focus
      cy.wrap($element)
        .shadow()
        .within(() => {
          // Fill incorrect name
          cy.get('va-text-input').then($textInput => {
            cy.fillVaTextInput($textInput, 'Wrong Name');
          });

          // Check the checkbox to trigger blur validation
          cy.get('va-checkbox').then($checkbox => {
            cy.selectVaCheckbox($checkbox, true);
          });
        });

      // Try to submit - this should trigger focus management
      cy.findByText(/submit/i, { selector: 'button' }).click();

      // Verify that the text input receives focus when there's an input error
      cy.wrap($element).should('have.attr', 'input-error');
      cy.wrap($element)
        .shadow()
        .within(() => {
          cy.get('va-text-input')
            .shadow()
            .find('input')
            .should('be.focused');
        });

      // Now test checkbox focus by fixing name but unchecking checkbox
      cy.wrap($element)
        .shadow()
        .within(() => {
          // Fix the name
          cy.get('va-text-input').then($textInput => {
            cy.fillVaTextInput($textInput, 'John Doe');
          });

          // Uncheck the checkbox
          cy.get('va-checkbox').then($checkbox => {
            cy.selectVaCheckbox($checkbox, false);
          });
        });

      // Try to submit again - should focus on checkbox
      cy.findByText(/submit/i, { selector: 'button' }).click();

      // Verify that the checkbox receives focus when there's a checkbox error
      cy.wrap($element).should('have.attr', 'checkbox-error');
      cy.wrap($element)
        .shadow()
        .within(() => {
          cy.get('va-checkbox')
            .shadow()
            .find('input')
            .should('be.focused');
        });
    });
  });

  it('should use the testVaStatementOfTruthFocus helper command', () => {
    cy.visit(
      '/disability/file-disability-claim-form-21-526ez/review-and-submit',
    );

    cy.injectAxeThenAxeCheck();

    // Use the helper command to test focus behavior
    cy.testVaStatementOfTruthFocus('va-statement-of-truth', {
      correctName: 'John Doe',
      incorrectName: 'Wrong Name',
    });
  });
});
