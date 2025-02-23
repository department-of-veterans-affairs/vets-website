import { medicationsUrls } from '../../../util/constants';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';
import prescriptions from '../fixtures/prescriptions.json';
import { Paths } from '../utils/constants';
import rxList from '../fixtures/listOfPrescriptions.json';
import allergies from '../fixtures/allergies.json';

class MedicationsLandingPage {
  clickExpandAllAccordionButton = () => {
    cy.contains('Expand all').click({ force: true });
  };

  verifyListMedicationsAndSuppliesAccordionDropDown = () => {
    cy.get('[data-testid="tool-information"]')
      .contains(
        'This tool lists medications and supplies prescribed by your VA providers. It also lists medications and supplies prescribed by non-VA providers, if you filled them through a VA pharmacy.',
      )
      .should('be.visible');
  };

  verifyWhatTypeOfPrescriptionsAccordionDropDown = () => {
    cy.get('[data-testid="track-refill-prescription-info"]')
      .contains(
        'You can refill and track your shipments of most VA prescriptions. This includes prescription medications and prescription supplies, like diabetic supplies.',
      )
      .should('be.visible');
  };

  visitLandingPageURL = () => {
    cy.intercept('GET', Paths.LANDING_LIST, rxList);
    cy.visit(medicationsUrls.MEDICATIONS_ABOUT);
  };

  verifyPrescriptionRefillRequestInformationAccordionDropDown = () => {
    cy.get('[data-testid="prescription-refill-info"]')
      .contains(
        'Prescriptions usually arrive within 3 to 5 days after we ship them. You can find tracking information in your prescription details.',
      )
      .should('be.visible');
  };

  verifyMoreQuestionsAccordionDropDown = () => {
    cy.get('[data-testid="more-questions"]')
      .contains(
        'For questions about your medications and supplies, send a secure message to your care team.',
      )
      .should('be.visible');
  };

  clickExpandAccordionsOnMedicationsLandingPage = () => {
    // cy.expandAccordions();
    cy.intercept(
      'GET',
      '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
      prescriptions,
    ).as('medicationsList');
    cy.get('[data-testid="more-ways-to-manage"]')
      .shadow()
      .find('[aria-label="Expand all accordions"]')
      .click({ waitForAnimations: true });
  };

  verifyHowtoRenewPrescriptionsAccordionDropDown = () => {
    cy.get('[data-testid="renew-information-button"]')
      .contains(
        'If your prescription is too old to refill or has no refills left, you’ll need to request a renewal.',
      )
      .should('be.visible');
  };

  verifyHowToConfirmOrUpdateMailingAddressAccordionDropDown = () => {
    cy.get('[data-testid="mailing-address-confirmation"]')
      .contains(
        'We’ll send your prescriptions to the address we have on file for you. We ship to all addresses in the U.S. and its territories. We don’t ship prescriptions to foreign countries.',
      )
      .should('be.visible');
  };

  verifyHowToReviewAllergiesAndReactionsAccordionDropDown = () => {
    cy.get('[data-testid="allergies-reactions-review"]')
      .contains(
        'Make sure your providers know about all your allergies and reactions to medications.',
      )
      .should('be.visible');
  };

  verifyNavigationToLandingPageAfterClickingBreadcrumb = () => {
    cy.get('[data-testid="landing-page-heading"]')
      .should('be.visible')
      .and('contain', 'About medications');
  };

  verifyHowToManageNotificationsAccordionDropDown = () => {
    cy.get('[data-testid="notifications"]').contains(
      'You can sign up to get email notifications when we ship your prescriptions.',
    );
  };

  verifyEmptyMedicationsListMessageAlertOnLandingPage = () => {
    cy.intercept('GET', Paths.LANDING_LIST, emptyPrescriptionsList).as(
      'emptyPrescriptionsList',
    );
    cy.get('[data-testid="empty-medications-list"]').should(
      'contain',
      'You don’t have any VA prescriptions',
    );
  };

  verifyErroMessageforFailedAPICallListPage = () => {
    cy.get('[data-testid="no-medications-list"]').should(
      'contain',
      'We can’t access your medications ',
    );
  };

  verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage = text => {
    cy.get('[data-testid="cerner-facilities-alert"]').should('contain', text);
  };

  verifyMultipleCernerAlertTextOnABoutMedicationsPage = text => {
    cy.get('[data-testid="single-cerner-facility-text"]').should(
      'contain',
      text,
    );
  };

  verifyMultipleCernerFacilityNamesAlertOnAboutMedicationsPage = (
    facilityName1,
    facilityName2,
  ) => {
    cy.get('[data-testid="cerner-facilities-alert"]')
      .should('contain', facilityName1)
      .and('contain', facilityName2);
  };

  verifyGoToYourAllergiesAndReactionsLinkOnAboutMedicationsPage = () => {
    cy.get('[data-testid="allergies-reactions-link"]').should(
      'contain',
      'Go to your allergies and reactions',
    );
  };

  visitLandingPageURLforEmptyMedicationsList = () => {
    cy.intercept('GET', Paths.LANDING_LIST, emptyPrescriptionsList);
    cy.visit(medicationsUrls.MEDICATIONS_ABOUT);
  };

  visitMedicationsListPage = prescriptionsList => {
    cy.intercept('GET', `${Paths.DELAY_ALERT}`, prescriptionsList).as(
      'delayAlertRxList',
    );
    cy.intercept('GET', `${Paths.MED_LIST}`).as('medicationsList');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');
    cy.intercept('GET', Paths.MED_LIST, prescriptionsList).as(
      'medicationsList',
    );
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
  };
}
export default MedicationsLandingPage;
