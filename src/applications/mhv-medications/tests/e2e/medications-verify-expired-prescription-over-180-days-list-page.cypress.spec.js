import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import expiredRxOver180Days from './fixtures/expired-rx-over-180-days-details-page.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Expired Rx Over 180 Days', () => {
  it('visits Medications Details Page ExpiredRx Over 180 Days', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyPrescriptionExpirationDateforRxOver180Days(
      expiredRxOver180Days,
    );
  });
});
