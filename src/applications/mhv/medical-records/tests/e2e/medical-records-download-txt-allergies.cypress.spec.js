import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergy from './fixtures/allergy.json';
import allergies from './fixtures/allergies.json';
import AllergiesListPage from './pages/AllergiesListPage';

describe('Medical Records View Allergies Print or download ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records');
  });

  it('Allergies Toggle Menu button Print or download on Details Page ', () => {
    // Given Navigate to Allergies List Page
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    // Verify List Page  PrintDownload button
    AllergiesListPage.verifyPrintOrDownload('Print or download');
    // Click List Page PrintDownload button
    AllergiesListPage.clickPrintOrDownload();
    // List Page should display print button for a list "Print this list"
    AllergiesListPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    AllergiesListPage.verifyDownloadPDF();
    // should display a download text file button "Download a text file (.txt) of this list"
    AllergiesListPage.verifyDownloadTextFile();

    // Given Navigate to Allergies Details Link
    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    // Verify Details Page PrintDownload button
    AllergyDetailsPage.verifyPrintOrDownload('Print or download');
    // Click Details Page PrintDownload button
    AllergyDetailsPage.clickPrintOrDownload();
    // Details Page should display print button for a list "Print this list"
    AllergyDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    AllergyDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download a text file (.txt) of this list"
    AllergyDetailsPage.verifyDownloadTextFile();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
