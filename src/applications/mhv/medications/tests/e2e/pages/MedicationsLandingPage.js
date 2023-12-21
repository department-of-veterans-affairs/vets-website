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
    cy.visit('my-health/medications/about');
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
    // cy.get('[data-testid="empty-list-alert"] >div ').should(
    cy.get('[data-testid="alert-message"]').should(
      'contain.text',
      'You don’t have any medications in your medications list',
    );
  };
}
export default MedicationsLandingPage;
