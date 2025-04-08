import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
// import vitals from './fixtures/vitals.json';
// import defaultVitals from '../fixtures/vitals.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Click next previous page, verify focus', () => {
    VitalsListPage.goToVitals();
    // visit blood pressure page
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    VitalsListPage.loadVAPaginationNext();
    VitalsListPage.loadVAPaginationPrevious();

    VitalsListPage.verifyFocusDisplayingRecords(
      'Displaying 1 to 10 of 31 records from newest to oldest',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
