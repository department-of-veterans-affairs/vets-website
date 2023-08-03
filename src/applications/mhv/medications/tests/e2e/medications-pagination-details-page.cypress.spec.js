import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/presciptions-page-2.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
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
    cy.get('[href="/my-health/medications/prescriptions"]').click();
    site.loadVAPaginationPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescirptionsDisplayed(1, 20, threadLength);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo, 1);
    site.verifyPaginationPrescirptionsDisplayed(21, 21, threadLength);
    site.loadVAPaginationPreviousPrescriptions(1, mockRxPageOne, 20);
    site.verifyPaginationPrescirptionsDisplayed(1, 20, threadLength);
    cy.get(
      '.vads-l-row > :nth-child(1) > .rx-card-detials > .link-to-details > [data-testid="medications-history-details-link"]',
    ).click();
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

describe('verify navigation to medication details Page', () => {
  it('verify Medications details Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    cy.visit('my-health/medications/');
    site.login();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.clickWhatToKnowAboutMedicationsDropDown();
    detailsPage.verifyTextInsideDropDownOnDetailsPage();

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
