import medicationsList from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';
import { medicationsUrls } from '../../../util/constants';

class MedicationsRefillPage {
  loadRefillPage = prescriptions => {
    cy.visit(medicationsUrls.MEDICATIONS_REFILL);
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
    cy.get('[data-testid="rx-breadcrumb"] > a').should('exist');
    cy.get('[data-testid="rx-breadcrumb"] > a').click({
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

  verifyActiveRxWithRefillsRemainingIsRefillableOnRefillPage = checkBox => {
    cy.get(`[data-testid="refill-prescription-checkbox-${checkBox}"]`).should(
      'be.enabled',
    );
  };

  verifyActiveRxStatusOnRefillPage = status => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[5].attributes).to.include({
          refillStatus: status,
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

  verifyActiveParkedRxWithRefillsStatus = status => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[8].attributes).to.include({
          refillStatus: status,
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

  verifyRxRenewSectionSubHeadingOnRefillPage = () => {
    cy.get('[data-testid="renew-section-subtitle"]').should(
      'contain',
      'If you can’t find the prescription',
    );
  };

  clickMedicationInRenewSection = (prescription, listNumber) => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions/get_prescription_image/00013264681',
      prescription,
    ).as('rxImage');
    cy.get(`[data-testid="medication-details-page-link-${listNumber}"]`).should(
      'exist',
    );
    cy.get(`[data-testid="medication-details-page-link-${listNumber}"]`).click({
      waitForAnimations: true,
    });
  };

  verifyExpiredRxOnRenewSection = rxStatus => {
    cy.get('[data-testid="status"]').should('contain', rxStatus);
  };

  verifyActiveParkedZeroRefillStatus = rxStatus => {
    cy.get('[data-testid="status"]').should('contain', rxStatus);
  };

  verifyActiveParkedZeroRefillsDispenseDate = activeParkedRx => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[11].attributes).to.include({
          dispensedDate: activeParkedRx,
        });
      });
  };

  verifyRefillsRemainingForActiveParkedZeroRefills = refills => {
    cy.get('[data-testid="refills-left"]').should('contain', refills);
  };

  verifyActiveRxZeroRefillsStatus = status => {
    cy.get('[data-testid="status"]').should('contain', status);
  };

  verifyRefillsRemainingForActiveRxZeroRefills = refills => {
    cy.get('[data-testid="refills-left"]').should('contain', refills);
  };

  verifyActiveRxZeroRefillsNoDispenseDateIsRefillableOnRefillPage = checkBox => {
    cy.get(`[data-testid="refill-prescription-checkbox-${checkBox}"]`).should(
      'be.enabled',
    );
  };

  verifyNullDispenseDateForActiveParkedZeroRefills = (
    activeParkedRx = null,
  ) => {
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[9].attributes).to.include({
          dispensedDate: activeParkedRx,
        });
      });
  };

  verifyRefillRemainingForActiveParkedRxZeroRefills = (
    prescription,
    refillsRemaining = 0,
  ) => {
    cy.get(
      `[data-testid="refill-prescription-details-${prescription}"]`,
    ).should('contain', refillsRemaining);
  };

  clickPrescriptionRefillCheckbox = prescription => {
    cy.intercept(
      'PATCH',
      '/my_health/v1/prescriptions/refill_prescriptions?ids[]=22545165',
      prescription,
    );
    cy.get('[data-testid="refill-prescription-checkbox-1"]').click({
      waitForAnimations: true,
    });
  };

  clickRefillRequestButton = () => {
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonforSuccessfulRequests = (prescriptionId, success) => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/refill_prescriptions?ids[]=${prescriptionId}`,
      success,
    );
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyFailedRequestMessageAlertOnRefillPage = () => {
    cy.get('[data-testid="failed-message-title"]').should('exist');
    cy.get('[data-testid="failed-message-title"]').should(
      'contain',
      'Request not submitted',
    );
  };

  verifyErrorMessageWhenRefillRequestWithoutSelectingPrescription = () => {
    cy.get('[data-testid="select-rx-error-message"]').should(
      'contain',
      'Select at least one prescription',
    );
  };

  verifyRefillRequestSuccessConfirmationMessage = () => {
    cy.get('[data-testid="success-message-title"]').should(
      'contain',
      'Refills requested',
    );
  };

  verifyMedicationRefillRequested = refillName => {
    cy.get('[data-testid="medication-requested"]').should(
      'contain',
      refillName,
    );
  };

  verifyNoMedicationsAvailableMessageOnRefillPage = () => {
    cy.get('[data-testid="no-refills-message"]').should(
      'contain',
      'You don’t have any VA prescriptions with refills',
    );
  };
}

export default MedicationsRefillPage;
