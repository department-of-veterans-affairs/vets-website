import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Microbiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(1);
    MicrobiologyDetailsPage.verifyLabName('Microbiology');
    MicrobiologyDetailsPage.verifyLabDate('August 3, 1995');
    MicrobiologyDetailsPage.verifySampleTested('None noted');
    MicrobiologyDetailsPage.verifySampleFrom('None noted');
    MicrobiologyDetailsPage.verifyOrderedBy('Beth M. Smith');
    MicrobiologyDetailsPage.verifyOrderingLocation(
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    );
    MicrobiologyDetailsPage.verifyCollectingLocation('None noted');
    MicrobiologyDetailsPage.verifyLabLocation(
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    );
    MicrobiologyDetailsPage.verifyDateCompleted(
      'August 3, 1995, 7:49 a.m. PDT',
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
