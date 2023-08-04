import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

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
    detailsPage.verifyRefillPrescriptionsText();
    detailsPage.verifyWhatDoesThisStatusMeanText();
    detailsPage.verifyPrescriptionsNumber();
    detailsPage.verifyPrescriptionsStatus();
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
