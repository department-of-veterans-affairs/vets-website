import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRx from './fixtures/active-on-hold-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Pharmacy Phone Number on Details Page for Rx Record', () => {
  it('visits Medications Details Page Pharmacy Phone Number for Rx Record ', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 10;
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(activeRx, cardNumber);
    detailsPage.verifyRxRecordPharmacyPhoneNumberOnDetailsPage(
      activeRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
