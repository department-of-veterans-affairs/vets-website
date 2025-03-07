import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rfRecord from './fixtures/rf-record-pharmacy-phone-number.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pharmacy Phone Number RF Record', () => {
  it('visits MedicationsDetails Page Pharmacy Phone Number for RF Record', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(rfRecord, cardNumber);
    detailsPage.verifyRfRecordPharmacyPhoneNumberOnDetailsPage(
      rfRecord.data.attributes.rxRfRecords[0].dialCmopDivisionPhone,
    );
  });
});
