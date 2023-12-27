import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import NotesDetailsPage from './pages/NotesDetailsPage';

describe('Medical Records Care Summary Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // Given Navigate to Notes Page
    cy.visit('my-health/medical-records/summaries-and-notes');
  });

  it('Discharge Summary Details  ', () => {
    // Very Care Summary Page title Text
    NotesDetailsPage.verifyCareSummaryPageText();

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);

    // Verify Discharge Summary Note Details Location
    NotesDetailsPage.verifyDischargeSummaryLocation('DAYTON');

    // Verify Discharge Summary Details DischargeDate
    NotesDetailsPage.verifyDischargeSummaryDischargeDate('August 9, 2022');
    // Verify Discharge Summary Admitted By --this is currently removed
    // NotesDetailsPage.verifyDischargeSummaryAdmittedBy('AHMED,NAJEEB');

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy('AHMED,MARUF');

    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote(
      'LOCAL TITLE: Discharge Summary',
    );

    // Click Back to Care summaries and notes
    // NotesDetailsPage.clickBreadCrumbsLink(0);

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
