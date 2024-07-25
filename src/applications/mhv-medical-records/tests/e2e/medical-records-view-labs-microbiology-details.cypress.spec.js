import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';
import microbio from './fixtures/labs-and-tests/microbio.json'; // comes from labsAndTests.entry[7]

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Microbiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4, microbio);
    // The application looks at the loinc code and determines the lab title should be microbiology
    MicrobiologyDetailsPage.verifyLabName('Microbiology');
    MicrobiologyDetailsPage.verifyLabDate('August 1, 1995');
    // MicrobiologyDetailsPage.verifyLabDate(
    //   moment(microbio.contained[2].effectiveDateTime).format('MMMM D, YYYY'),
    // );
    MicrobiologyDetailsPage.verifySampleTested('None noted');
    MicrobiologyDetailsPage.verifySampleFrom('None noted');
    MicrobiologyDetailsPage.verifyOrderedBy('DOE, JANE A');
    MicrobiologyDetailsPage.verifyCollectingLocation('None noted');
    MicrobiologyDetailsPage.verifyLabLocation(
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    );
    MicrobiologyDetailsPage.verifyDateCompleted('August 1, 1995');
    // MicrobiologyDetailsPage.verifyDateCompleted(
    //   moment(microbio.contained[2].effectiveDateTime).format('MMMM D, YYYY'),
    // );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
