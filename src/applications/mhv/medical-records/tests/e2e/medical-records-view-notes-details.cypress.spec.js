import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';

describe('Medical Records View Notes', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    cy.visit('my-health/medical-records/summaries-and-notes');
  });

  it('Care summaries and notes Page  ', () => {
    cy.get('[data-testid="care-summaries-and-notes"]').should('be.visible');
    // should display ProgressNote
    NotesDetailsPage.clickProgressNoteLink(0);
    // Verify Details
    NotesDetailsPage.verifyDetails();
    // Verify Location
    // Verify Signed by
    // Verify Date Signed

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

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
