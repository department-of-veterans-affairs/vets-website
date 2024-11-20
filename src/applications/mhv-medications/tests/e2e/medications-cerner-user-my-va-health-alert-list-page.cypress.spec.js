import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe.skip('Medications Landing Page Cerner User Alert and list Page Error', () => {
  it('visits cerner user my va health alert and Error for List of Prescriptions', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    site.cernerLoginPrescriptionListError();
    landingPage.visitLandingPageURL();
    // landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage();
    listPage.clickGotoMedicationsLinkForListPageAPICallFail();
    landingPage.verifyErroMessageforFailedAPICallListPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
