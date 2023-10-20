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
    cy.expandAccordions();
  };

  verifyHowtoRenewPrescriptionsAccordionDropDown = () => {
    cy.get('[data-testid="renew-information-button"]')
      .contains(
        'If your prescription is too old to refill or has no refills left, you’ll need to request a renewal. The fastest way to renew is by calling the phone number on your prescription label. You can also send a secure message to your care team.',
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

  verifyEmptyMedicationsListMessageAlertOnLandingPage = () => {
    cy.get('[data-testid="empty-list-alert"] >div ').should(
      'have.text',
      'You don’t have any medications in your medications listNote: This list doesn’t include older prescriptions that have been inactive for more than 180 days. To find these older prescriptions, go to your VA Blue Button report on the My HealtheVet website. Go to VA Blue Button® on the My HealtheVet website',
    );
  };
}
export default MedicationsLandingPage;
