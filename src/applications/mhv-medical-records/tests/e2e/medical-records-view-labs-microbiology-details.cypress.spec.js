import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Microbiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    const record = labsAndTests.entry[2].resource;
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4, labsAndTests.entry[2]);
    // The application looks at the loinc code and determines the lab title should be microbiology
    MicrobiologyDetailsPage.verifyLabName('LR MICROBIOLOGY REPORT');
    // MicrobiologyDetailsPage.verifyLabDate('August 1, 1995');
    MicrobiologyDetailsPage.verifyLabDate(
      moment(record.effectiveDateTime).format('MMMM D, YYYY'),
    );
    MicrobiologyDetailsPage.verifySampleTested('None noted');
    MicrobiologyDetailsPage.verifySampleFrom(record.contained[1].type.text);
    MicrobiologyDetailsPage.verifyOrderedBy('None noted'); // DOE, JANE A
    MicrobiologyDetailsPage.verifyCollectingLocation('None noted');
    // '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428'
    MicrobiologyDetailsPage.verifyDateCompleted(
      moment(record.effectiveDateTime).format('MMMM D, YYYY'),
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
