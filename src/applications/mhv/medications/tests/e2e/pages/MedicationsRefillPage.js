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
}

export default MedicationsRefillPage;
