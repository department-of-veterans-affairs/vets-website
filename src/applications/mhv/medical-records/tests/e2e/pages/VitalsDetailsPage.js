// import defaultVitals from '../fixtures/Vitals.json';

class VitalsDetailsPage {
  verifyVitalsPageText = Vitals => {
    // Verify "Vitals" Page title Text
    cy.get('[data-testid="vitals"]').should('be.visible');
    cy.get('[data-testid="vitals"]').contains(Vitals);
  };

  clickBreadCrumbsLink = (breadcrumb = 0) => {
    // Click Back to "Vitals" Page
    cy.get('[data-testid="breadcrumbs"]')
      .find('a')
      .eq(breadcrumb)
      .click();
  };

  clickBloodPressureLink = (bloodPressure = 0) => {
    // Click Vitals Page Blood Pressure Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(bloodPressure)
      .click();
  };

  clickHeartRateLink = (HeartRate = 1) => {
    // Click Vitals Page Heart Rate Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(HeartRate)
      .click();
  };

  clickWeightLink = (Weight = 2) => {
    // Click Vitals Page Weight Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(Weight)
      .click();
  };

  clickPainLink = (Pain = 3) => {
    // Click Vitals Page Blood Pressure Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(Pain)
      .click();
  };

  verifyVitalDate = VitalDate => {
    // Verify Vital Date
    cy.get('[data-testid="vital-date"]').should('be.visible');
    cy.get('[data-testid="vital-date"]').contains(VitalDate);
  };

  verifyVitalResult = VitalResult => {
    // Verify Vital Result
    cy.get('[data-testid="vital-result"]').should('be.visible');
    cy.get('[data-testid="vital-result"]').contains(VitalResult);
  };

  verifyVitalLocation = VitalLocation => {
    // Verify Vital Details Location
    cy.get('[data-testid="vital-location"]').should('be.visible');
    cy.get('[data-testid="vital-location"]').contains(VitalLocation);
  };

  verifyVitalProviderNotes = VitalProviderNotes => {
    // Verify Vital Details Provider Notes
    cy.get('[data-testid="vital-provider-note"]').should('be.visible');
    cy.get('[data-testid="vital-provider-note"]').contains(VitalProviderNotes);
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
    // should display a download pdf file button "Download list as a pdf file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new VitalsDetailsPage();
