import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';
// import pathology from './fixtures/labs-and-tests/pathology.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[8]);
    PathologyDetailsPage.verifyLabName(labsAndTests.entry[8].code.text);
    PathologyDetailsPage.verifyLabDate(
      moment(labsAndTests.entry[8].effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifySampleTested(
      labsAndTests.entry[8].contained[0].type.text,
    );
    PathologyDetailsPage.verifyLabLocation('None noted');
    PathologyDetailsPage.verifyDateCompleted(
      moment(labsAndTests.entry[8].effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifyReport('None noted');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
