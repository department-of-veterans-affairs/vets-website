import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rfRecord from './fixtures/rf-record-pharmacy-phone-number.json';

describe('Medications List Page Pharmacy Phone Number RF Record', () => {
  it('visits Medications List Page Pharmacy Phone Number for RF Record', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyRFRecordPhoneNumberOnListPage(
      rfRecord.data.attributes.rxRfRecords[0].dialCmopDivisionPhone,
    );
  });
});
