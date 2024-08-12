import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import nonVARx from './fixtures/non-VA-prescription-on-list-page.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Non VA Prescription ', () => {
  it('visits Medications Active NonVA Rx Details Page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    const cardNumber = 5;
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(nonVARx, cardNumber);
    detailsPage.verifyNonVaMedicationStatusOnDetailsPage(nonVARx);
    // detailsPage.verifyNonVAMedicationDisplayMessageOnDetailsPage(nonVARx);
    listPage.verifyPrescriptionSourceForNonVAMedicationOnDetailsPage();
  });
});
