import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(9, labsAndTests.entry[9]);
    PathologyDetailsPage.verifyLabName(labsAndTests.entry[9].code.text);
    PathologyDetailsPage.verifyLabDate(
      moment(labsAndTests.entry[9].effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifySampleTested('None noted');
    PathologyDetailsPage.verifyLabLocation('None noted');
    PathologyDetailsPage.verifyDateCompleted(
      moment(labsAndTests.entry[9].effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifyReport(labsAndTests.entry[9].conclusion);

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
