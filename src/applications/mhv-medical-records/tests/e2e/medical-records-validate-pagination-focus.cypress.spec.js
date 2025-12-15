import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Click next previous page, verify focus', () => {
    VitalsListPage.goToVitals();
    // visit blood pressure page
    VitalsListPage.clickLinkByRecordListItem('Blood pressure');

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
