class AllergyDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.contains(
      'If you print this page, it won’t include your allergies and reactions to allergies.',
    );
  };

  clickWhatToKnowAboutallergiesDropDown = () => {
    cy.contains('What to know before you print or download').click({
      force: true,
    });
  };

  clickAllergyDetailsLink = (allergyTitle, allergyId, allergyDetails) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/allergies/${allergyId}`,
      allergyDetails,
    ).as('allergyDetails');
    cy.get('[data-testid="record-list-item"]')
      .contains(allergyTitle)
      .should('be.visible');
    cy.get('[data-testid="record-list-item"]')
      .contains(allergyTitle)
      .click();
  };

  verifyAllergyDetailReaction = reaction => {
    cy.get('[data-testid="allergy-reaction"]').should('contain', reaction);
  };

  verifyAllergyDetailType = type => {
    cy.get('[data-testid="allergy-type"]').should('contain', type);
  };

  verifyAllergyDetailLocation = location => {
    cy.get('[data-testid="allergy-location"]').should('contain', location);
  };

  verifyAllergyDetailObserved = observed => {
    cy.get('[data-testid="allergy-observed"]').should('contain', observed);
  };

  verifyAllergyDetailNotes = notes => {
    cy.get('[data-testid="allergy-notes"]').should('contain', notes);
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
  };

  verifyPrintOrDownload = () => {
    // should display a toggle menu button
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyDownloadPDF = () => {
    // should display a download pdf file button "Download PDF of this page"
    cy.get('[data-testid="printButton-1"]').should('be.visible');
  };

  verifyDownloadTextFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-2"]').should('be.visible');
  };

  verifyBreadcrumbs = breadcrumbsText => {
    cy.get('[data-testid="breadcrumbs"]').should(
      'contain',
      `‹ ${breadcrumbsText}`,
    );
  };

  verifySidenavHighlightAllergies = () => {
    cy.get('.is-active').should('contain', 'Allergies and reactions');
  };
}
export default new AllergyDetailsPage();
