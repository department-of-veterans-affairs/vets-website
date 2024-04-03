import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRxNoImage from './fixtures/active-prescriptions-with-refills.json';

describe('Medications Refill History No Image on Details Page', () => {
  it('visits prescription refill history No Medication Image on details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyCmopNdcNumberIsNull();
    detailsPage.clickMedicationDetailsLink(activeRxNoImage);

    detailsPage.verifyNoImageFieldMessageOnDetailsPage();
  });
});
