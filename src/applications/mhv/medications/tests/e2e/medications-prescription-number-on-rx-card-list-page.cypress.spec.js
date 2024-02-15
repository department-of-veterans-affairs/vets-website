import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionsDetails from './fixtures/prescription-details.json';

describe('Medications Prescription Number On Card On List Page', () => {
  it('visits Medications Rx Number On Medication Card On List Page ', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyPrescriptionNumberIsVisibleOnRxCardOnListPage(
      prescriptionsDetails.data.attributes.prescriptionNumber,
    );
  });
});
