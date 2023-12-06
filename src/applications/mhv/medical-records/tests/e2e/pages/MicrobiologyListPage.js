// import defaultMicrobiology from './fixtures/microbiology.json';

class MicrobiologyListPage {
  /*
  clickGotoMicrobiologyLink = (
   Microbiology = defaultMicrobiology,
    waitForMicrobiology = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/Microbiology',
      Microbiology,
    ).as('MicrobiologyList');
    cy.get('[href="/my-health/medical-records/ex-MHV-labReport-1"]').click();
    if (waitForMicrobiology) {
      cy.wait('@MicrobiologyList');
    }
  };
}
*/

  clickMicrobiologyDetailsLink = (_MicrobiologyIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_MicrobiologyIndex)
      .click();
  };

  /* These will be needed later when there is print functionality on the list page
  verifyPrintOrDownload = () => {
    // should display a toggle menu button
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
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
  */
}

export default new MicrobiologyListPage();
