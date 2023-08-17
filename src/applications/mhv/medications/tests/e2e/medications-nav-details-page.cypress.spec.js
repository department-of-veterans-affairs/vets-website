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
    detailsPage.verifyPrescriptionsNumber(
      mockPrescriptionDetails.data.attributes.prescriptionNumber,
    );
    detailsPage.verifyPrescriptionsStatus(
      mockPrescriptionDetails.data.attributes.refillStatus,
    );
    detailsPage.verifyPrescriptionsName(
      mockPrescriptionDetails.data.attributes.prescriptionName,
    );

    detailsPage.verifyPrescriptionsfacilityName(
      mockPrescriptionDetails.data.attributes.facilityName,
    );

    detailsPage.verifyPrescriptionsorderedDate(
      mockPrescriptionDetails.data.attributes.orderedDate,
    );

    detailsPage.verifyPrescriptionsquantity(
      mockPrescriptionDetails.data.attributes.quantity,
    );
    detailsPage.verifyPrescriptionsexpirationDate(
      mockPrescriptionDetails.data.attributes.expirationDate,
    );
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
