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
    const record = labsAndTests.entry[8].resource;
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[8]);
    PathologyDetailsPage.verifyLabName(record.code.text);
    PathologyDetailsPage.verifyLabDate(
      moment(record.contained[0].collection.collectedDateTime).format(
        'MMMM D, YYYY',
      ),
    );
    // record.contained[0].collection.bodySite.text,
    // pertains to "site or sample tested" IF IT EXISTS
    PathologyDetailsPage.verifySampleTested('None recorded'); // sample from field: (record.contained[0].type.text);
    PathologyDetailsPage.verifyLabLocation('None recorded');
    PathologyDetailsPage.verifyReport('None recorded');
    PathologyDetailsPage.verifyDateCompleted(
      moment(record.effectiveDateTime).format('MMMM D, YYYY'),
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
