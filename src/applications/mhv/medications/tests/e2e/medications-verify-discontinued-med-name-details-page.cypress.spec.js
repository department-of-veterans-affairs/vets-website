import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import discontinuedRx from './fixtures/discontinued-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Discontinued Med Name', () => {
  it('visits Medications Details Page Discontinued Med Name', () => {
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
    listPage.verifyDiscontinuedMedicationNameIsVisibleOnListPage(
      discontinuedRx,
    );
    detailsPage.clickMedicationDetailsLink(discontinuedRx);
  });
});
