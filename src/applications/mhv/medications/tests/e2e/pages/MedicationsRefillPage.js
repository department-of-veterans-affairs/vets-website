import medicationsList from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';

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

  verifySelectAllRefillCheckBoxExists = () => {
    cy.get('[data-testid="select-all-checkbox"]').should('exist');
  };

  clickSelectAllRefillCheckBox = () => {
    cy.get('[data-testid="select-all-checkbox"]')
      .shadow()
      .find('#option-label')
      .click({
        force: true,
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

  clickOneRefillCheckBoxOnRefillPage = () => {
    cy.get(`[data-testid="refill-prescription-checkbox-0"]`).should('exist');
    cy.get(`[data-testid="refill-prescription-checkbox-0"]`).click({
      waitForAnimations: true,
    });
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

  verifyRequestRefillsButtonExistsForOneRefill = numberOfRefills => {
    cy.get('[data-testid="request-refill-button"]')
      .shadow()
      .find('[type ="button"]', { force: true })
      .should('contain', `Request ${numberOfRefills} refill`);
  };

  clickSomeRefillCheckBoxesOnRefillPage = numberOfCheckboxes => {
    for (let i = 1; i < `${numberOfCheckboxes}`; i++) {
      cy.get(`[data-testid="refill-prescription-checkbox-${i}"]`).click({
        waitForAnimations: true,
      });
    }
  };

  verifySomeRefillCheckBoxesClicked = numberOfCheckboxes => {
    for (let i = 1; i < `${numberOfCheckboxes}`; i++) {
      cy.get(`[data-testid="refill-prescription-checkbox-${i}"]`).should(
        'be.checked',
      );
    }
  };

  verifyTotalRefillablePrescriptionsCount = count => {
    cy.get('[data-testid="refill-page-list-count"]').should(
      'contain',
      `You have ${count} prescriptions ready to refill.`,
    );
  };
}

export default MedicationsRefillPage;
