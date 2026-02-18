import medicationsList from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';
import { medicationsUrls } from '../../../util/constants';
import { Paths } from '../utils/constants';

class MedicationsRefillPage {
  // basePath can be set per test based on feature flag state
  basePath = 'my_health/v1';

  // Helper to determine HTTP method based on basePath
  isV2 = () => {
    return this.basePath.includes('v2');
  };

  getRefillMethod = () => {
    return this.isV2() ? 'POST' : 'PATCH';
  };

  loadRefillPage = (prescriptions, basePath = this.basePath) => {
    this.basePath = basePath;
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      `${this.basePath}/prescriptions/list_refillable_prescriptions`,
      prescriptions,
    ).as('refillList');
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.visit(medicationsUrls.MEDICATIONS_REFILL);
  };

  loadRefillPageV2 = (prescriptions, basePath = this.basePath) => {
    this.basePath = basePath;
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptions).as(
      'delayAlertRxList',
    );
    cy.intercept(
      'GET',
      `${this.basePath}/prescriptions/list_refillable_prescriptions`,
      prescriptions,
    ).as('refillList');
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.visit(medicationsUrls.MEDICATIONS_URL);
  };

  loadRefillPageForApiCallFailure = () => {
    cy.visit(medicationsUrls.MEDICATIONS_REFILL);
  };

  verifyRefillPageTitle = () => {
    cy.findByTestId('refill-page-title').should(
      'contain',
      'Refill prescriptions',
    );
  };

  verifySelectAllRefillCheckBoxExists = () => {
    cy.findByTestId('select-all-checkbox').should('exist');
  };

  clickSelectAllRefillCheckBox = () => {
    cy.findByTestId('select-all-checkbox').click();
  };

  verifyRequestRefillsButtonExists = numberOfRefills => {
    cy.findByTestId('request-refill-button')
      .shadow()
      .find('[type ="button"]', { force: true })
      .should('contain', `Request ${numberOfRefills} refills`);
  };

  verifyRefillCheckBoxesClicked = numberOfCheckboxes => {
    for (let i = 0; i < `${numberOfCheckboxes}`; i++) {
      cy.findByTestId(`refill-prescription-checkbox-${i}`).should(
        'be.visible',
        { force: true },
      );
    }
  };

  clickOneRefillCheckBoxOnRefillPage = () => {
    cy.findByTestId(`refill-prescription-checkbox-0`).should('exist');
    cy.findByTestId(`refill-prescription-checkbox-0`).click({
      waitForAnimations: true,
    });
  };

  verifyRefillPageRenewSectionTitleExists = () => {
    cy.findByTestId('renew-section-subtitle').should(
      'have.text',
      'If your prescription isn’t ready to refill',
    );
  };

  clickLearnHowToRenewPrescriptionsLink = () => {
    cy.findByTestId('learn-to-renew-prescriptions-link').should('exist');
    cy.findByTestId('learn-to-renew-prescriptions-link')
      .first()
      .click({ waitForAnimations: true });
    cy.intercept('GET', Paths.MED_LIST, medicationsList).as('medicationsList');
  };

  clickGoToMedicationsListPage = () => {
    cy.intercept(
      'GET',
      `${this.basePath}/prescriptions?page=1&per_page=20All%20medications`,
      medicationsList,
    ).as('medicationsList');
    cy.intercept(
      'GET',
      `${
        this.basePath
      }/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true`,
      medicationsList,
    );
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept('GET', Paths.MED_LIST, medicationsList).as('medicationsList');
    cy.findByTestId('medications-page-link').should('exist');
    cy.findByTestId('medications-page-link')
      .first()
      .click({ waitForAnimations: true });
  };

  clickBackToMedicationsBreadcrumbOnRefillPage = () => {
    cy.intercept('GET', Paths.MED_LIST, medicationsList).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true',
      medicationsList,
    );
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.findByTestId('rx-breadcrumb')
      .find('a')
      .should('exist');
    cy.findByTestId('rx-breadcrumb')
      .find('a')
      .click({
        waitForAnimations: true,
      });
  };

  verifyShippedMedicationOnRefillPage = () => {
    cy.findByTestId('refill-prescription-checkbox-0')
      .invoke('attr', 'checkbox-description')
      .should('contain', 'Last filled on October 2, 2023');
  };

  verifyRequestRefillsButtonExistsForOneRefill = numberOfRefills => {
    cy.findByTestId('request-refill-button')
      .shadow()
      .find('[type ="button"]', { force: true })
      .should('contain', `Request ${numberOfRefills} refill`);
  };

  clickSomeRefillCheckBoxesOnRefillPage = numberOfCheckboxes => {
    for (let i = 1; i < `${numberOfCheckboxes}`; i++) {
      cy.findByTestId(`refill-prescription-checkbox-${i}`).click({
        waitForAnimations: true,
      });
    }
  };

  verifySomeRefillCheckBoxesClicked = numberOfCheckboxes => {
    for (let i = 1; i < `${numberOfCheckboxes}`; i++) {
      cy.findByTestId(`refill-prescription-checkbox-${i}`).should('be.checked');
    }
  };

  verifyTotalRefillablePrescriptionsCount = count => {
    cy.findByTestId('refill-checkbox-group', { includeShadowDom: true })
      .shadow()
      .find('[class="usa-legend"]', { force: true })
      .should('contain', `You have ${count} prescriptions ready to refill.`);
  };

  verifyActiveRxWithRefillsRemainingIsRefillableOnRefillPage = checkBox => {
    cy.findByTestId(`refill-prescription-checkbox-${checkBox}`).should(
      'be.visible',
    );
  };

  verifyActiveRxStatusOnRefillPage = status => {
    cy.get('@refillList')
      .its('response.body.data.5.attributes.refillStatus')
      .should('equal', status);
  };

  verifyRefillsRemainingForActiveRxOnRefillPage = (
    checkBox,
    refillsRemaining,
  ) => {
    cy.findByTestId(`refill-prescription-checkbox-${checkBox}`)
      .invoke('attr', 'checkbox-description')
      .should('contain', refillsRemaining);
  };

  verifyActiveParkedRxWithRefillsRemainingIsRefillableOnRefillPage = () => {
    cy.findByTestId('refill-prescription-checkbox-1').should('be.visible');
  };

  verifyActiveParkedRxWithRefillsStatus = status => {
    cy.get('@refillList')
      .its('response.body.data.8.attributes.refillStatus')
      .should('equal', status);
  };

  verifyRefillsRemainingForActiveParkedRxOnRefillPage = refillsRemaining => {
    cy.findByTestId('refill-prescription-checkbox-1')
      .invoke('attr', 'checkbox-description')
      .should('contain', refillsRemaining);
  };

  verifyRxRenewSectionSubHeadingOnRefillPage = () => {
    cy.findByTestId('renew-section-subtitle').should(
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
    cy.findByTestId(`medication-details-page-link-${listNumber}`).should(
      'exist',
    );
    cy.findByTestId(`medication-details-page-link-${listNumber}`)
      .first()
      .click({ waitForAnimations: true });
  };

  verifyExpiredRxOnRenewSection = rxStatus => {
    cy.findByTestId('status').should('contain', rxStatus);
  };

  verifyActiveParkedZeroRefillStatus = rxStatus => {
    cy.findByTestId('status').should('contain', rxStatus);
  };

  verifyActiveParkedZeroRefillsDispenseDate = activeParkedRx => {
    cy.get('@refillList')
      .its('response.body.data.11.attributes.dispensedDate')
      .should('equal', activeParkedRx);
  };

  verifyRefillsRemainingForActiveParkedZeroRefills = refills => {
    cy.findByTestId('refills-left').should('contain', refills);
  };

  verifyActiveRxZeroRefillsStatus = status => {
    cy.findByTestId('status').should('contain', status);
  };

  verifyRefillsRemainingForActiveRxZeroRefills = refills => {
    cy.findByTestId('refills-left').should('contain', refills);
  };

  verifyActiveRxZeroRefillsNoDispenseDateIsRefillableOnRefillPage = checkBox => {
    cy.findByTestId(`refill-prescription-checkbox-${checkBox}`).should(
      'be.visible',
    );
  };

  verifyNullDispenseDateForActiveParkedZeroRefills = (
    activeParkedRx = null,
  ) => {
    cy.get('@refillList')
      .its('response.body.data.9.attributes')
      .should('have.property', 'dispensedDate', activeParkedRx);
  };

  verifyRefillRemainingForActiveParkedRxZeroRefills = (
    checkBox,
    refillsRemaining = 0,
  ) => {
    cy.findByTestId(`refill-prescription-checkbox-${checkBox}`)
      .invoke('attr', 'checkbox-description')
      .should('contain', refillsRemaining);
  };

  clickPrescriptionRefillCheckbox = prescription => {
    const url = this.isV2()
      ? `${this.basePath}/prescriptions/refill`
      : `${this.basePath}/prescriptions/refill_prescriptions?ids[]=22377949`;
    cy.intercept(this.getRefillMethod(), url, prescription);
    cy.findByTestId('refill-prescription-checkbox-2').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonForFailedRequest = (
    prescriptionId,
    failedRequest,
  ) => {
    const url = this.isV2()
      ? `${this.basePath}/prescriptions/refill`
      : `${
          this.basePath
        }/prescriptions/refill_prescriptions?ids[]=${prescriptionId}`;
    cy.intercept(this.getRefillMethod(), url, failedRequest).as(
      'failedRefillRequest',
    );
    cy.findByTestId('request-refill-button').should('exist');
    cy.findByTestId('request-refill-button').click({
      waitForAnimations: true,
    });
  };

  clickRefillRequestButton = () => {
    cy.findByTestId('request-refill-button').should('exist');
    cy.findByTestId('request-refill-button').click({
      waitForAnimations: true,
    });
  };

  clickPrescriptionRefillCheckboxForSuccessfulRequestV2 = ({
    index = 0,
  } = {}) => {
    cy.findByTestId(`refill-prescription-checkbox-${index}`).click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonForSuccessfulRequestsV2 = success => {
    cy.intercept(
      this.getRefillMethod(),
      `${this.basePath}/prescriptions/refill`,
      req => {
        // assert that the req.body is an array of objects with the id and stationNumber keys
        expect(req.body).to.deep.equal([
          {
            id: 22545165,
            stationNumber: '989',
          },
        ]);
        req.reply(success);
      },
    ).as('refillSuccess');
    cy.findByTestId('request-refill-button').should('exist');
    cy.findByTestId('request-refill-button').click({
      waitForAnimations: true,
    });
  };

  clickPrescriptionRefillCheckboxForSuccessfulRequest = prescription => {
    const url = this.isV2()
      ? `${this.basePath}/prescriptions/refill`
      : `${this.basePath}/prescriptions/refill_prescriptions?ids[]=22545165`;
    cy.intercept(this.getRefillMethod(), url, prescription);
    cy.findByTestId('refill-prescription-checkbox-0').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonforSuccessfulRequests = (prescriptionId, success) => {
    const url = this.isV2()
      ? `${this.basePath}/prescriptions/refill`
      : `${
          this.basePath
        }/prescriptions/refill_prescriptions?ids[]=${prescriptionId}`;
    cy.intercept(this.getRefillMethod(), url, success).as('refillSuccess');
    cy.findByTestId('request-refill-button').should('exist');
    cy.findByTestId('request-refill-button').click({
      waitForAnimations: true,
    });
  };

  clickRequestRefillButtonforPartialSuccessfulRequests = (
    prescriptionId1,
    prescriptionId2,
    partialsuccess,
  ) => {
    const url = this.isV2()
      ? `${this.basePath}/prescriptions/refill`
      : `${
          this.basePath
        }/prescriptions/refill_prescriptions?ids[]=${prescriptionId1}&ids[]=${prescriptionId2}`;
    cy.intercept(this.getRefillMethod(), url, partialsuccess);
    cy.findByTestId('request-refill-button').should('exist');
    cy.findByTestId('request-refill-button').click({
      waitForAnimations: true,
    });
  };

  verifyPartialSuccessAlertOnRefillPage = () => {
    cy.findByTestId('partial-refill-title').should(
      'contain',
      'Only part of your request was submitted',
    );
  };

  verifyFailedRequestMessageAlertOnRefillPage = text => {
    cy.findByTestId('error-refill-title', { includeShadowDom: true })
      .should('be.visible')
      .first()
      .and('contain', text);
  };

  verifyPartiallyFailedRequestMessageAlertOnRefillPage = text => {
    cy.findByTestId('partial-refill-title', {
      includeShadowDom: true,
    })
      .should('be.visible')
      .first()
      .and('contain', text);
  };

  verifyNetworkResponseForFailedRefillRequest = failedId => {
    cy.get('@failedRefillRequest')
      .its('response.body.failedIds.0')
      .should('contain', failedId);
  };

  verifyErrorMessageWhenRefillRequestWithoutSelectingPrescription = () => {
    cy.findByTestId('refill-checkbox-group', { includeShadowDom: true })
      .shadow()
      .find('[id="checkbox-error-message"]')
      .should('contain', 'Select at least one prescription');
  };

  verifyRefillRequestSuccessConfirmationMessage = () => {
    cy.findByTestId('success-refill-title').should(
      'contain',
      'Refills requested',
    );
  };

  verifyMedicationRefillRequested = refillName => {
    cy.findByTestId('successful-medication-list').should('contain', refillName);
  };

  verifyNetworkResponseForSuccessfulRefillRequest = successfulId => {
    cy.get('@refillSuccess')
      .its('response.body.successfulIds.0')
      .should('contain', successfulId);
  };

  verifyNoMedicationsAvailableMessageOnRefillPage = () => {
    cy.findByTestId('no-refills-message').should(
      'contain',
      'You don’t have any VA prescriptions with refills',
    );
  };

  verifyRenewListCountonRefillPage = (
    displayedStartNumber,
    displayedEndNumber,
    listLength,
  ) => {
    cy.findByTestId('renew-page-list-count').should(
      'contain',
      `Showing ${displayedStartNumber} - ${displayedEndNumber} of ${listLength} prescriptions`,
    );
  };

  verifyRenewableSectionHeaderOnRefillPage = () => {
    cy.findByTestId('renewable-rx').should(
      'contain',
      'Prescriptions you may need to renew',
    );
  };

  verifyRenewableSectionDescriptionOnRefillPage = () => {
    cy.findByTestId('renew-section-description').should(
      'contain',
      'find medications with a status of Active: Submitted or Active: Refill in process.',
    );
  };

  verifyShippedRxInformationOnRenewSectionRefillsPage = shippedDate => {
    cy.findByTestId('shipped-date').should('contain', shippedDate);
  };

  clickMedicationsListPageLinkOnRefillSuccessAlertOnRefillsPage = () => {
    cy.intercept('GET', Paths.MED_LIST, medicationsList).as('medicationsList');
    cy.intercept(
      'GET',
      `${
        this.basePath
      }/prescriptions?&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date&include_image=true`,
      medicationsList,
    );
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.findByTestId('back-to-medications-page-link').should('be.visible');
    cy.findByTestId('back-to-medications-page-link').click({
      waitForAnimations: true,
    });
  };

  verifyRefillSuccessDescriptionText = () => {
    cy.findByTestId('success-refill-description').should(
      'contain',
      'recently requested',
    );
  };

  verifyNoteOnRefillPageAboutRenewal = () => {
    cy.findByTestId('note-refill-page').should(
      'contain',
      'renewal needed before refill',
    );
  };

  verifySuccessAlertTextDoesNotExistOnRefillPage = () => {
    cy.findByTestId('success-refill-title').should('not.exist');
  };

  verifyFailedAlertTextDoesNotExistOnRefillPage = () => {
    cy.findByTestId('error-refill-description').should('not.exist');
  };

  verifyCernerUserMyVAHealthAlertOnRefillsPage = text => {
    cy.findByTestId('cerner-facilities-alert').should('contain', text);
  };

  verifyRefillDelayAlertBannerOnRefillPage = text => {
    cy.findByTestId('rxDelay-alert-message').should('have.text', text);
  };

  verifyRefillDelayAlertNotVisibleOnRefillPage(text) {
    cy.findByTestId('rxDelay-alert-message')
      .should('have.text', text)
      .and('not.be.visible');
  }

  verifyRefillDetailsLinkVisibleOnDelayAlertBanner = rxName => {
    cy.findByTestId('alert-banner').should('contain', rxName);
  };

  verifyNeedHelpSectionOnRefillPage = text => {
    cy.findByTestId('rx-need-help-container').should('contain', text);
  };

  verifyGoToUseMedicationLinkOnRefillPage = () => {
    cy.findByTestId('go-to-use-medications-link').should('be.visible');
  };

  verifyStartANewMessageLinkOnRefillPage = () => {
    cy.findByTestId('start-a-new-message-link').should('be.visible');
  };

  verifyHowRefillProcessWorksListHeaderTextOnRefillPage = text => {
    cy.findByTestId('progress-list-header').should('contain', text);
  };

  verifyProcessStepOneHeaderOnRefillPage = text => {
    cy.get('[header="You request a refill"]').should('contain', text);
  };

  verifyProcessStepTwoHeaderOnRefillPage = text => {
    cy.get('[header="We process your refill request"]').should('contain', text);
  };

  verifyProcessStepThreeHeaderOnRefillPage = text => {
    cy.get('[header="We ship your refill to you"]').should('contain', text);
  };

  verifyProcessStepThreeNoteOnRefillPage = text => {
    cy.get('[header="We ship your refill to you"]').should('contain', text);
  };

  verifyFailedAlertTextExistsOnRefillPage = (description, suggestion) => {
    cy.findByTestId('error-refill-description')
      .should('have.text', description)
      .and('be.visible');
    cy.findByTestId('error-refill-suggestion')
      .should('have.text', suggestion)
      .and('be.visible');
  };

  // V2 Management Improvements methods

  verifyRefillPageTitleV2 = () => {
    cy.findByTestId('refill-page-title').should('contain', 'Medications');
  };

  verifyRefillPageSubtitleV2 = () => {
    cy.findByTestId('refill-page-subtitle').should(
      'contain',
      'Medications you can refill now',
    );
  };

  verifyRefillSuccessDescriptionTextV2 = () => {
    cy.findByTestId('success-refill-description').should(
      'contain',
      'in-progress medications',
    );
  };

  verifySuccessLinkGoesToInProgressV2 = () => {
    cy.findByTestId('back-to-medications-page-link')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', '/my-health/medications/in-progress');
  };

  verifySuccessLinkTextV2 = () => {
    cy.findByTestId('back-to-medications-page-link').should(
      'contain',
      'Go to your in-progress medications',
    );
  };

  verifyMedicationNameBoldedInSuccessList = prescriptionName => {
    cy.findByTestId('successful-medication-list')
      .find('strong')
      .should('contain', prescriptionName);
  };

  verifyProcessStepOneContentV2 = () => {
    cy.get('[header="You request a refill"]').should('contain', 'In progress');
  };

  verifyProcessStepThreeContentV2 = () => {
    cy.get('[header="We ship your refill to you"]').should(
      'contain',
      'Shipped',
    );
  };

  verifyRenewableMedsLinkV2 = () => {
    cy.findByTestId('medications-page-link').should(
      'contain',
      'Go to your list of renewable meds',
    );
  };
}

export default MedicationsRefillPage;
