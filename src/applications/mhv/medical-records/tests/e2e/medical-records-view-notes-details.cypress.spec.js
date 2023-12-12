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
    NotesDetailsPage.verifyProgressNoteLocation('DAYTSHR TEST LAB');
    // Verify Progress Note Details Signed by
    NotesDetailsPage.verifyProgressNoteSignedBy('AHMED,MARUF');
    // Verify Progress Note Details Signed Date
    NotesDetailsPage.verifyProgressNoteSignedDate('August 8, 2022');
    // Verify Progress Note Record Details
    NotesDetailsPage.verifyProgressNoteRecord(
      'LOCAL TITLE: Adverse React/Allergy',
    );

    // Click Back to Care summaries and notes
    NotesDetailsPage.clickBreadCrumbsLink(0);

    // should display Discharge Summary
    NotesDetailsPage.clickDischargeSummaryLink(1);

    // Verify Discharge Summary Note Details Location
    NotesDetailsPage.verifyDischargeSummaryLocation('DAYTON');
    // Verify Discharge Summary Details Admission Date
    NotesDetailsPage.verifyDischargeSummaryAdmissionDate('August 5, 2022');
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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
