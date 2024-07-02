import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pharmacy Phone Number for Unknown Rx', () => {
  it('visits Medications Details Page Pharmacy Phone Number for Unknown Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 7;
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(unknownRx, cardNumber);
    detailsPage.verifyUnknownRxPharmacyPhoneNumberOnDetailsPage(
      unknownRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
