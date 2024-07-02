import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Microbiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(2, labsAndTests.entry[2]);
    MicrobiologyDetailsPage.verifyLabName('Microbiology');
    MicrobiologyDetailsPage.verifyLabDate('August 3, 1995');
    MicrobiologyDetailsPage.verifySampleTested('None noted');
    MicrobiologyDetailsPage.verifySampleFrom('None noted');
    MicrobiologyDetailsPage.verifyOrderedBy('DOE, JANE A');
    // MicrobiologyDetailsPage.verifyOrderingLocation(
    //   '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    // );
    MicrobiologyDetailsPage.verifyCollectingLocation('None noted');
    MicrobiologyDetailsPage.verifyLabLocation(
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    );
    MicrobiologyDetailsPage.verifyDateCompleted(
      moment('August 3, 1995').format('MMMM D, YYYY'),
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
