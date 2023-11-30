import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import transferredRx from './fixtures/transferred-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Transferred Status DropDown', () => {
  it('visits Medications Details Page Transferred Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(transferredRx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyTransferredStatusDropDownDefinition();
  });
});
