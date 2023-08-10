class MedicationsLandingPage {
  clickExpandAllAccordionButton = () => {
    cy.contains('Expand all').click({ force: true });
  };

  verifyFirstAccordionDropDown = () => {
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

  verifyPrescriptionRefillRequestInformationDropDown = () => {
    cy.get('[data-testid="prescription-refill-info"]')
      .contains(
        'Prescriptions usually arrive within 3 to 5 days after we ship them. You can find tracking information in your prescription details.',
      )
      .should('be.visible');
  };

  verifyMoreQuestionsDropDown = () => {
    cy.get('[data-testid="more-questions"]')
      .contains(
        'For questions about your medications and supplies, send a secure message to your care team.',
      )
      .should('be.visible');
  };
}
export default MedicationsLandingPage;
