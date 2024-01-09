// import defaultVaccines from '../fixtures/Vaccines.json';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';
import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';

class VaccinesListPage {
  clickGotoVaccinesLink = (
    Vaccines = defaultVaccines,
    waitForVaccines = false,
  ) => {
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines', Vaccines).as(
      'VaccinesList',
    );
    cy.get('[href="/my-health/medical-records/vaccines"]').click();
    if (waitForVaccines) {
      cy.wait('@VaccinesList');
    }
  };

  clickVaccinesDetailsLink = (
    _VaccinesIndex = 0,
    VaccinesDetails = defaultVaccineDetail,
    wait = false,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/vaccines/${VaccinesDetails.id}`,
      VaccinesDetails,
    ).as('vaccineDetails');
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VaccinesIndex)
      .click();
    if (wait) {
      cy.wait('@vaccineDetails');
    }
  };

  verifyPrintOrDownload = PrintOrDownload => {
    // Verify Vital Details Page "Print or download" button
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').contains(PrintOrDownload);
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
  };

  verifyDownloadPDF = () => {
    // should display a download pdf file button "Download PDF of this page"
    cy.get('[data-testid="printButton-1"]').should('be.visible');
  };

  verifyDownloadTextFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-2"]').should('be.visible');
    // cy.get('[data-testid="printButton-2').click();
  };

  clickDownloadPDFFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new VaccinesListPage();
