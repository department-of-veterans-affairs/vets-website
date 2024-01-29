import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergy from './fixtures/allergy.json';
import allergies from './fixtures/allergies.json';
import AllergiesListPage from './pages/AllergiesListPage';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records');
    cy.reload({ force: true });
    // Given Navigate to Allergy Page

    AllergiesListPage.clickGotoAllergiesLink(allergies);

    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
  });

  it('Toggle Menu button Print or download on Details Page ', () => {
    // should display a toggle menu button
    AllergyDetailsPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    AllergyDetailsPage.clickPrintOrDownload();
    AllergyDetailsPage.verifyPrintButton();
    cy.injectAxe();
    cy.axeCheck('main');
    // should display a download pdf file button "Download PDF of this page"
    AllergyDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    AllergyDetailsPage.verifyDownloadTextFile();

    cy.reload({ force: true });
  });
});
