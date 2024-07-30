import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import pathology from './fixtures/labs-and-tests/pathology.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(9, pathology);
    PathologyDetailsPage.verifyLabName(pathology.code.text);
    PathologyDetailsPage.verifyLabDate(
      moment(pathology.effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifySampleTested('None noted');
    PathologyDetailsPage.verifyLabLocation('None noted');
    PathologyDetailsPage.verifyDateCompleted(
      moment(pathology.effectiveDateTime).format('MMMM D, YYYY'),
    );
    PathologyDetailsPage.verifyReport(pathology.conclusion);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
