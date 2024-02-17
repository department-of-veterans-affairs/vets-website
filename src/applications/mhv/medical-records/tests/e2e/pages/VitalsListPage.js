import defaultVitals from '../../fixtures/vitals.json';

class VitalsListPage {
  /*
    clickGotoVitalsLink = (
     /* Vitals = defaultVitals,
      waitForVitals = false,
    ) => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/vitals',
        Vitals,
      ).as('VitalsList');
      cy.get('[href="/my-health/medical-records/vitals"]').click();
      if (waitForVitals) {
        cy.wait('@VitalsList');
      }
    });
  }
  */

  goToVitals = (vitals = defaultVitals, waitForVitals = false) => {
    // cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    // cy.wait('@session');
    cy.intercept('GET', '/my_health/v1/medical_records/vitals', vitals).as(
      'vitalsList',
    );
    cy.visit('my-health/medical-records/vitals');
    if (waitForVitals) {
      cy.wait('@vitalsList');
    }
  };

  verifyVitalOnListPage = (index, name, measurement, date, location) => {
    cy.get('[data-testid="vital-li-display-name"]')
      .eq(index)
      .contains(name);
    cy.get('[data-testid="vital-li-measurement"]')
      .eq(index)
      .contains(measurement);
    cy.get('[data-testid="vital-li-date"]')
      .eq(index)
      .contains(date);
    cy.get('[data-testid="vital-li-location"]')
      .eq(index)
      .contains(location);
  };

  clickVitalsDetailsLink = (_VitalsIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VitalsIndex)
      .click();
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click();
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
    // cy.get('[data-testid="printButton-2').click();
  };

  clickDownloadPDFFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new VitalsListPage();
