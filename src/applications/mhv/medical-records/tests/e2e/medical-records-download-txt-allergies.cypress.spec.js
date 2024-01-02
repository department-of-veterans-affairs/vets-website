import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergy from './fixtures/allergy.json';
import allergies from './fixtures/allergies.json';
import AllergiesListPage from './pages/AllergiesListPage';

for (let i = 0; i < 200; i += 1) {
  describe('Medical Records View Allergies', () => {
    const site = new MedicalRecordsSite();

    before(() => {
      site.login();
      cy.visit('my-health/medical-records');
      // Given Navigate to Allergy Page
      cy.reload();
      AllergiesListPage.clickGotoAllergiesLink(allergies);
      AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    });

    it('Toggle Menu button Print or download on Details Page ', () => {
      // should display a toggle menu button
      AllergyDetailsPage.verifyPrintOrDownload();

      // should display print button for a list "Print this list"
      AllergyDetailsPage.clickPrintOrDownload();
      AllergyDetailsPage.verifyPrintButton();

      // should display a download pdf file button "Download PDF of this page"
      AllergyDetailsPage.verifyDownloadPDF();

      // should display a download text file button "Download list as a text file"
      AllergyDetailsPage.verifyDownloadTextFile();

      cy.injectAxe();
      cy.axeCheck('main');
    });
  });
}
