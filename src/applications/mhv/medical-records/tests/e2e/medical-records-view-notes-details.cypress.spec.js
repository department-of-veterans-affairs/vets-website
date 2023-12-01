import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesListPage from './pages/NotesListPage';

describe('Medical Records View Notes', () => {
  it('Visits Medical Records View Notes Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/summaries-and-notes');

    NotesListPage.clickNotesDetailsLink(0);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
