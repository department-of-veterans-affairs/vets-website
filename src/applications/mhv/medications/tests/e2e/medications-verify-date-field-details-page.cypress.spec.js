import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('verify navigation to medication details Page Date Field', () => {
  it('verify Medications details Page date field', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications/');

    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.verifyPrescriptionsExpirationDate(
      mockPrescriptionDetails.data.attributes.expirationDate,
    );
    detailsPage.verifyPrescriptionsOrderedDate();

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
  });
});
