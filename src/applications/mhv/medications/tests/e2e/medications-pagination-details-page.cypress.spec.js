import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/presciptions-page-2.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Landing Page', () => {
  it.skip('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/medications');
    site.login();
    const threadLength = 21;
    mockRxPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPAgeSize = threadLength;
    });
    listPage.clickGotoMedicationsLink();
    // cy.get('[href="/my-health/medications/prescriptions"]').click();
    site.loadVAPaginationPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescirptionsDisplayed(1, 20, threadLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo, 1);
    site.verifyPaginationPrescirptionsDisplayed(21, 21, threadLength);
    site.loadVAPaginationPreviousPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescirptionsDisplayed(1, 20, threadLength);
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
