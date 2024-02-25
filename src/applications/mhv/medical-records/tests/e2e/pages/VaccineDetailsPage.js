import moment from 'moment';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';

class VaccinesDetailsPage {
  verifyVaccineName = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="vaccine-name"]').contains(
      VaccinesDetails.resource.vaccineCode.text,
    );
  };

  verifyVaccineDate = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="header-time"]').contains(
      moment(VaccinesDetails.resource.occurrenceDateTime).format(
        'MMMM D, YYYY',
      ),
    );
  };

  verifyVaccineLocation = (VaccinesDetails = defaultVaccines.entry[0]) => {
    cy.get('[data-testid="vaccine-location"]').contains(
      VaccinesDetails.resource.contained[0].name,
    );
  };

  verifyVaccineNotes = (
    VaccinesDetails = defaultVaccines.entry[0],
    noteIndex = 0,
  ) => {
    if (VaccinesDetails.resource.note.length === 1) {
      cy.get('[data-testid="list-item-single"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.note[noteIndex].text);
    }

    if (VaccinesDetails.resource.note.length > 1) {
      cy.get('[data-testid="list-item-multiple"]')
        .eq(noteIndex)
        .contains(VaccinesDetails.resource.note[noteIndex].text);
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

export default new VaccinesDetailsPage();
