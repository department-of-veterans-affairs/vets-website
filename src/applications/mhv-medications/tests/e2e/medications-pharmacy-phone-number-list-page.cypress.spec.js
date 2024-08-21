import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRx from './fixtures/active-on-hold-prescription-details.json';

describe('Medications List Page Pharmacy Phone Number', () => {
  it('visits Medications List Page Pharmacy Phone Number for Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyPharmacyPhoneNumberOnListPage(
      activeRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
