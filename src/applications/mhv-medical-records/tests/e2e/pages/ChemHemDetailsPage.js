import BaseDetailsPage from './BaseDetailsPage';
import { formatDateForDownload } from '../../../util/dateHelpers';

class ChemHemDetailsPage extends BaseDetailsPage {
  downloadTime1sec = '';

  downloadTime2sec = '';

  downloadTime3sec = '';

  downloadtime4sec = '';

  verifySampleTested = sampleTested => {
    cy.get('[data-testid="chem-hem-sample-tested"]').should(
      'contain',
      sampleTested,
    );
  };

  verifyLabName = name => {
    cy.get('[data-testid="chem-hem-name"]').should('contain', name);
  };

  verifyLabDate = date => {
    cy.get('[data-testid="header-time"]').should('contain', date);
  };

  verifyOrderedBy = orderedBy => {
    cy.get('[data-testid="chem-hem-ordered-by"]').should('contain', orderedBy);
  };

  verifyLabCollectingLocation = locationCollected => {
    cy.get('[data-testid="chem-hem-collecting-location"]').should(
      'contain',
      locationCollected,
    );
  };

  verifyProviderNotesSingle = notes => {
    cy.get('[data-testid="list-item-single"]').should('contain', notes);
  };

  verifyProviderNotesMultiple = notes => {
    cy.get('[data-testid="list-item-multiple"]').should('contain', notes);
  };

  verifyDownloadTextFileHeadless = (
    userFirstName = 'Safari',
    userLastName = 'Mhvtp',
    searchText = 'Date',
  ) => {
    // should display a download text file button "Download list as a text file"
    this.downloadTime1sec = formatDateForDownload(1);
    this.downloadTime2sec = formatDateForDownload(2);
    this.downloadTime3sec = formatDateForDownload(3);

    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${this.downloadTime1sec}.txt`;
      const txtPath2 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${this.downloadTime2sec}.txt`;
      const txtPath3 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${this.downloadTime3sec}.txt`;
      this.internalReadFileMaybe(txtPath1, searchText);
      this.internalReadFileMaybe(txtPath2, searchText);
      this.internalReadFileMaybe(txtPath3, searchText);
      // cy.readFile(`${downloadsFolder}/*`);
    } else {
      cy.log('browser is not headless');
    }
    // cy.get('[data-testid="printButton-2').click();
  };

  internalReadFileMaybe = (fileName, searchText) => {
    cy.task('log', `attempting to find file = ${fileName}`);
    cy.task('readFileMaybe', fileName).then(textOrNull => {
      const taskFileName = fileName;
      if (textOrNull != null) {
        cy.task('log', `found the text in ${taskFileName}`);
        cy.readFile(fileName).should('contain', `${searchText}`);
      }
    });
  };

  verifyComposeMessageLink = composeMessageLink => {
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="new-message-link"]').should('be.visible');
    cy.get('[data-testid="new-message-link"]')
      .contains(composeMessageLink)
      .invoke('attr', 'href')
      .should('contain', '/my-health/secure-messages/new-message');
  };
}

export default new ChemHemDetailsPage();
