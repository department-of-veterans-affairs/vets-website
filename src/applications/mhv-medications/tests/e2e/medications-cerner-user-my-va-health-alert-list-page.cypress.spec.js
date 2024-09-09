import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Landing Page Cerner User Alert and list Page Error', () => {
  it('visits cerner user my va health alert and Error for List of Prescriptions', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.cernerLoginPrescriptionListError();
    landingPage.visitLandingPageURL();
    landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage();
    landingPage.verifyErroMessageforFailedAPICallListPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
