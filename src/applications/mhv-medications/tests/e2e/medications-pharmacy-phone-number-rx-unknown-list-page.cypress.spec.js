import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';

describe('Medications List Page Pharmacy Phone Number for Unknown Rx', () => {
  it('visits Medications List Page Pharmacy Phone Number for Unknown Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyUnknownRxPhoneNumberOnListPage(
      unknownRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
