import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Unknown Status DropDown', () => {
  it('visits Medications Details Page Unknown Status DropDown', () => {
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
    detailsPage.clickMedicationDetailsLink(unknownRx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyUnknownStatusDropDownDefinition();
  });
});
