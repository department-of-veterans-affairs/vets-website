import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rfRecord from './fixtures/rf-record-pharmacy-phone-number.json';

describe('Medications List Page Pharmacy Phone Number RF Record', () => {
  it('visits Medications List Page Pharmacy Phone Number for RF Record', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyRFRecordPhoneNumberOnListPage(
      rfRecord.data.attributes.rxRfRecords[0].dialCmopDivisionPhone,
    );
  });
});
