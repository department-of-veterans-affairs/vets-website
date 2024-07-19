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
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
  };

  loadRefillPageForApiCallFailure = () => {
    cy.visit(medicationsUrls.MEDICATIONS_REFILL);
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
        'be.visible',
        { force: true },
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
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]')
      .first()
      .click({
        waitForAnimations: true,
      });
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      medicationsList,
    ).as('medicationsList');
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
    cy.get('[data-testid="medications-page-link"]')
      .first()
      .click({
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

  clickMedicationsLandingPageBreadcrumbsOnRefillPage = () => {
    cy.get('[data-testid="rx-breadcrumb"]').should('be.visible');
    cy.get('[data-testid="rx-breadcrumb"]')
      .find(`[href="${medicationsUrls.MEDICATIONS_ABOUT}"]`)
      .click({
        waitForAnimations: true,
      });
  };

  verifyShippedMedicationOnRefillPage = () => {
    cy.get('[data-testid="refill-prescription-checkbox-0"]')
      .shadow()
      .find('[aria-describedby="option-label"]')
      .should('contain', 'Last filled on October 2, 2023');
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
      'be.visible',
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
    checkBox,
    refillsRemaining,
  ) => {
    cy.get(`[data-testid="refill-prescription-checkbox-${checkBox}"]`)
      .shadow()
      .find('[aria-describedby="option-label"]')
      .should('contain', refillsRemaining);
  };

  verifyActiveParkedRxWithRefillsRemainingIsRefillableOnRefillPage = () => {
    cy.get('[data-testid="refill-prescription-checkbox-1"]')
      .shadow()
      .find('#option-label')
      .should('be.visible');
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

  verifyRefillsRemainingForActiveParkedRxOnRefillPage = refillsRemaining => {
    cy.get('[data-testid="refill-prescription-checkbox-1"]')
      .shadow()
      .find('[aria-describedby="option-label"]')
      .should('contain', refillsRemaining);
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
    cy.get(`[data-testid="medication-details-page-link-${listNumber}"]`)
      .first()
      .click({
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
      'be.visible',
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
    checkBox,
    refillsRemaining = 0,
  ) => {
    cy.get(`[data-testid="refill-prescription-checkbox-${checkBox}"]`)
      .shadow()
      .find('[aria-describedby="option-label"]')
      .should('contain', refillsRemaining);
  };

  clickPrescriptionRefillCheckbox = prescription => {
    cy.intercept(
      'PATCH',
      '/my_health/v1/prescriptions/refill_prescriptions?ids[]=22377949',
      prescription,
    );
    cy.get('[data-testid="refill-prescription-checkbox-2"]').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonForFailedRequest = (
    prescriptionId,
    failedRequest,
  ) => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/refill_prescriptions?ids[]=${prescriptionId}`,
      failedRequest,
    ).as('failedRefillRequest');
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  clickRefillRequestButton = () => {
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  clickPrescriptionRefillCheckboxForSuccessfulRequest = prescription => {
    cy.intercept(
      'PATCH',
      '/my_health/v1/prescriptions/refill_prescriptions?ids[]=22545165',
      prescription,
    );
    cy.get('[data-testid="refill-prescription-checkbox-0"]').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonforSuccessfulRequests = (prescriptionId, success) => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/refill_prescriptions?ids[]=${prescriptionId}`,
      success,
    ).as('refillSuccess');
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonforPartialSuccessfulRequests = (
    prescriptionId1,
    prescriptionId2,
    partialsuccess,
  ) => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/prescriptions/refill_prescriptions?ids[]=${prescriptionId1}&ids[]=${prescriptionId2}`,
      partialsuccess,
    );
    cy.get('[data-testid="request-refill-button"]').should('exist');
    cy.get('[data-testid="request-refill-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyPartialSuccessAlertOnRefillPage = () => {
    cy.get('[data-testid="failed-message-title"]').should(
      'contain',
      'Only part of your request was submitted',
    );
  };

  verifyFailedRequestMessageAlertOnRefillPage = () => {
    cy.get('[data-testid="failed-message-title"]').should('exist');
    cy.get('[data-testid="failed-message-title"]').should(
      'contain',
      'Request not submitted',
    );
  };

  verifyNetworkResponseForFailedRefillRequest = failedId => {
    cy.get('@failedRefillRequest')
      .its('response')
      .then(res => {
        expect(res.body.failedIds[0]).to.contain(failedId);
      });
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

  verifyNetworkResponseForSuccessfulRefillRequest = successfulId => {
    cy.get('@refillSuccess')
      .its('response')
      .then(res => {
        expect(res.body.successfulIds[0]).to.contain(successfulId);
      });
  };

  verifyNoMedicationsAvailableMessageOnRefillPage = () => {
    cy.get('[data-testid="no-refills-message"]').should(
      'contain',
      'You don’t have any VA prescriptions with refills',
    );
  };

  verifyRenewListCountonRefillPage = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.get('[data-testid="renew-page-list-count"]').should(
      'contain',
      `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength} prescriptions`,
    );
  };

  verifyRenewableSectionHeaderOnRefillPage = () => {
    cy.get('[data-testid="renewable-rx"]').should(
      'contain',
      'Prescriptions you may need to renew',
    );
  };

  verifyRenewableSectionDescriptionOnRefillPage = () => {
    cy.get('[data-testid="renew-section-description"]').should(
      'contain',
      'find medications with a status of Active: Submitted or Active: Refill in process.',
    );
  };

  verifyShippedRxInformationOnRenewSectionRefillsPage = shippedDate => {
    cy.get('[data-testid="shipped-date"]').should('contain', shippedDate);
  };
}

export default MedicationsRefillPage;
