import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageTwo from './fixtures/prescriptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescriptions-details-page-2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications details Page Back Browser', () => {
  it('visits Medications Details Page Browser Back to List View', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    cy.visit('my-health/about-medications');

    const threadLength = 29;
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails);
    cy.go('back');
    site.verifyPaginationPrescriptionsDisplayed(21, 29, threadLength);
  });
});
