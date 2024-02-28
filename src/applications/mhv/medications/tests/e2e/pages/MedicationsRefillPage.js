class MedicationsRefillPage {
  loadRefillPage = prescriptions => {
    cy.visit('/my-health/medications/refill');
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions/list_refillable_prescriptions',
      prescriptions,
    );
  };

  verifyRefillPageTitle = () => {
    cy.get('[data-testid="refill-page-title"]').should(
      'contain',
      'Refill prescriptions',
    );
  };

  verifySelectAllRefillButtonExists = () => {
    cy.get('[data-testid="select-all-button"]').should('exist');
  };

  clickSelectAllRefillButton = () => {
    cy.get('[data-testid="select-all-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyRequestRefillsButtonExists = () => {
    cy.get('[data-testid="request-refill-button"]')
      .shadow()
      .find('[type ="button"]')
      .should('contain', 'Request refills');
  };

  verifyRefillCheckBoxIsClicked = () => {
    for (let i = 0; i < 2; i++) {
      cy.get(`[data-testid="refill-prescription-checkbox-${i}"]`).should(
        'be.checked',
      );
    }
  };
}

export default MedicationsRefillPage;
