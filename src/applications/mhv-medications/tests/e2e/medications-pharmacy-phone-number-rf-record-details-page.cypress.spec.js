import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rfRecord from './fixtures/rf-record-pharmacy-phone-number.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pharmacy Phone Number RF Record', () => {
  it('visits MedicationsDetails Page Pharmacy Phone Number for RF Record', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rfRecord, cardNumber);
    detailsPage.verifyRfRecordPharmacyPhoneNumberOnDetailsPage(
      rfRecord.data.attributes.rxRfRecords[0].dialCmopDivisionPhone,
    );
  });
});
