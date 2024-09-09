import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxFacilityName from './fixtures/prescription-facility-name-details-page.json';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 20;
    site.login();
    // cy.visit('my-health/about-medications/');
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rxFacilityName, cardNumber);
    detailsPage.verifyFacilityInPlainLanguageOnDetailsPage(
      rxFacilityName.data.attributes.facilityName,
    );
  });
});
