import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import nonVARx from './fixtures/non-VA-prescription-on-list-page.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page NonVARx Status DropDown', () => {
  it('visits Medications Details Page Active NonVA Rx Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(nonVARx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyNonVAStatusDropDownDefinition();
  });
});
