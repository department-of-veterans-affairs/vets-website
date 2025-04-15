import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRx from './fixtures/active-on-hold-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Pharmacy Phone Number on Details Page for Rx Record', () => {
  it('visits Medications Details Page Pharmacy Phone Number for Rx Record ', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 10;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(activeRx, cardNumber);
    detailsPage.verifyRxRecordPharmacyPhoneNumberOnDetailsPage(
      activeRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
