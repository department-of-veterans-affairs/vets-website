import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';

describe('Medications List Page Pharmacy Phone Number for Unknown Rx', () => {
  it('visits Medications List Page Pharmacy Phone Number for Unknown Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyUnknownRxPhoneNumberOnListPage(
      unknownRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
