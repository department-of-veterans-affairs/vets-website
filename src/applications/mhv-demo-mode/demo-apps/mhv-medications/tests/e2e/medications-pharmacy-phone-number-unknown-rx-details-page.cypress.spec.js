import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pharmacy Phone Number for Unknown Rx', () => {
  it('visits Medications Details Page Pharmacy Phone Number for Unknown Rx', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 7;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(unknownRx, cardNumber);
    detailsPage.verifyUnknownRxPharmacyPhoneNumberOnDetailsPage(
      unknownRx.data.attributes.dialCmopDivisionPhone,
    );
  });
});
