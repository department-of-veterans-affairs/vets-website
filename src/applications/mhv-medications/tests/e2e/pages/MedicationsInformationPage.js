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

  verifyApiErrorText = () => {
    cy.get('[data-testid="no-medications-list"]')
      .should('be.visible')
      .and('contain', 'We can’t access your medication information right now');
  };

  verifyNoInformationWarningText = () => {
    cy.get('[data-testid="medication-information-no-info"]')
      .should('be.visible')
      .and(
        'contain',
        'We’re sorry. We don’t have any information about this medication.',
      );
  };

  clickDownloadPDFOnInformationPage = () => {
    cy.get('[data-testid="download-pdf-button"]').should('be.visible');
    cy.get('[data-testid="download-pdf-button"]').click({
      waitForAnimations: true,
    });
  };

  clickDownloadTXTOnInformationPage = () => {
    cy.get('[data-testid="download-txt-button"]').should('be.visible');
    cy.get('[data-testid="download-txt-button"]').click({
      waitForAnimations: true,
    });
  };

  verifyDownloadSuccessConfirmationMessageOnMedInfoPage = text => {
    cy.get('[data-testid="download-success-banner"]')
      .should('be.visible')
      .and('contain', text);
  };

  verifyMedicationDescriptionInDownload = (text, downloadFormat) => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    const now = new Date();
    const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    const fileName = `${downloadsFolder}/medication-information-BACITRACIN 500 UNT_GM OPH OINT-${date}.${downloadFormat}`;
    cy.readFile(fileName).then(fileContent => {
      expect(fileContent).to.contain(text);
    });
  };
}

export default MedicationsInformationPage;
