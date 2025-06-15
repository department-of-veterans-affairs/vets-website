import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRx from './fixtures/active-on-hold-prescription-details.json';

describe('Medications List Page Pharmacy Phone Number', () => {
  it('visits Medications List Page Pharmacy Phone Number for Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyPharmacyPhoneNumberOnListPage(
      activeRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
