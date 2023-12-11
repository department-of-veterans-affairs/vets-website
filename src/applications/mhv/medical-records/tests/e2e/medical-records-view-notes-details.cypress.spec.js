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
    // Very Care Summary Page title Text
    NotesDetailsPage.verifyCareSummaryPageText();
    // should display Progress Note
    NotesDetailsPage.clickProgressNoteLink(0);

    // Verify Progress Note Details Location
    NotesDetailsPage.verifyProgressNoteLocation();
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy();
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate();
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord();

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);

    // Verify Discharge Summary Note Details Location
    NotesDetailsPage.verifyDischargeSummaryLocation();
    // Verify Discharge Summary Details Admission Date
    NotesDetailsPage.verifyDischargeSummaryAdmissionDate();
    // Verify Discharge Summary Details DischargeDate
    NotesDetailsPage.verifyDischargeSummaryDischargeDate();
    // Verify Discharge Summary Admitted By
    NotesDetailsPage.verifyDischargeSummaryAdmittedBy();

    // Verify Discharge Summary discharged By
    NotesDetailsPage.verifyDischargeSummaryDischargedBy();

    // Verify Discharge Summary Note
    NotesDetailsPage.verifyDischargeSummaryNote();

    // Click Back to Care summaries and notes
    // NotesDetailsPage.clickBreadCrumbsLink(0);

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
