import medicationsList from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';

class MedicationsRefillPage {
  loadRefillPage = prescriptions => {
    cy.visit('/my-health/medications/refill');
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions/list_refillable_prescriptions',
      prescriptions,
    ).as('refillList');
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

  verifyRequestRefillsButtonExists = numberOfRefills => {
    cy.get('[data-testid="request-refill-button"]')
      .shadow()
      .find('[type ="button"]', { force: true })
      .should('contain', `Request ${numberOfRefills} refills`);
  };

  verifyRefillCheckBoxesClicked = numberOfCheckboxes => {
    for (let i = 0; i < `${numberOfCheckboxes}`; i++) {
      cy.get(`[data-testid="refill-prescription-checkbox-${i}"]`).should(
        'be.checked',
      );
    }
  };

  verifyRefillPageRenewSectionTitleExists = () => {
    cy.get('[data-testid="renew-section-subtitle"]').should(
      'have.text',
      'If your prescription isn’t ready to refill',
    );
  };

  clickLearnHowToRenewPrescriptionsLink = () => {
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]').should('exist');
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]').click({
      waitForAnimations: true,
    });
  };

  clickGoToMedicationsListPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      medicationsList,
    ).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      medicationsList,
    );
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.get('[data-testid="medications-page-link"]').should('exist');
    cy.get('[data-testid="medications-page-link"]').click({
      waitForAnimations: true,
    });
  };

  clickBackToMedicationsBreadcrumbOnRefillPage = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      medicationsList,
    ).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      medicationsList,
    );
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.get('[data-testid="back-to-medications-page-link"]').should('exist');
    cy.get('[data-testid="back-to-medications-page-link"]').click({
      waitForAnimations: true,
    });
  };

  verifyShippedMedicationOnRefillPage = () => {
    cy.get('[data-testid="medications-last-shipped-3"]').should(
      'contain',
      'Last refill shipped on September 24, 2023',
    );
  };

  verifyActiveRxWithRefillsRemainingIsRefillableOnRefillPage = () => {
    cy.get('[data-testid="refill-prescription-checkbox-0"]').should(
      'be.enabled',
    );
  };

  verifyActiveRxWithRefillsRemainingIsDisplayedOnRefillPage = () => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[5].attributes).to.include({
          refillStatus: 'active',
        });
      });
  };

  verifyRefillsRemainingForActiveRxOnRefillPage = (
    prescription,
    refillsRemaining,
  ) => {
    cy.get(
      `[data-testid="refill-prescription-details-${prescription}"]`,
    ).should('contain', refillsRemaining);
  };

  verifyActiveParkedRxWithRefillsRemainingIsRefillableOnRefillPage = () => {
    cy.get('[data-testid="refill-prescription-checkbox-1"]').should(
      'be.enabled',
    );
  };

  verifyActiveParkedRxWithRefillsRemainingIsDisplayedOnRefillPage = () => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[8].attributes).to.include({
          refillStatus: 'activeParked',
        });
      });
  };

  verifyRefillsRemainingForActiveParkedRxOnRefillPage = (
    prescription,
    refillsRemaining,
  ) => {
    cy.get(
      `[data-testid="refill-prescription-details-${prescription}"]`,
    ).should('contain', refillsRemaining);
  };
}

export default MedicationsRefillPage;
