import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF on List Page', () => {
  it('visits download pdf on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/about-medications/');
    site.login();
    listPage.clickGotoMedicationsLink();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyDownloadListAsPDFButtonOnListPage();
  });
});
