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

  it('Visits View Vitals List', () => {
    VitalsListPage.goToVitals();
    VitalsListPage.clickLinkByRecordListItemIndex(0);

    VitalsListPage.loadVAPaginationNext();
    VitalsListPage.loadVAPaginationPrevious();

    VitalsListPage.verifyFocusDisplayingRecords();
    VitalsListPage.verifyFocusDisplayingRecords(
      'Displaying 1 to 10 of 31 records from newest to oldest',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
