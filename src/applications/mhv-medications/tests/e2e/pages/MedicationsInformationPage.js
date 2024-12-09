class MedicationsInformationPage {
  clickWhatToKnowBeforeYouPrintOrDownloadDropDown = () => {
    cy.get('[data-testid="dropdown-info"]').should('be.visible');
    cy.get('[data-testid="dropdown-info"]').click({
      waitForAnimations: true,
    });
  };

  verifyTextInsideDropDownOnInformationPage = () => {
    cy.get('[data-testid="dropdown-info"]').should(
      'contain',
      'If you’re on a public or shared computer',
    );
  };

  verifyBreadCrumbsTextDoesNotHaveRxName = (breadcrumb, text) => {
    cy.get('[data-testid="rx-breadcrumb-link"]')
      .shadow()
      .should('have.text', breadcrumb)
      .and('not.have.text', text);
  };
}

export default MedicationsInformationPage;
