import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rxFacilityName from './fixtures/prescription-facility-name-details-page.json';

describe('Medications Facility Name in Plain Language', () => {
  it('visits Medications Facility Name', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 20;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(rxFacilityName, cardNumber);
    detailsPage.verifyFacilityInPlainLanguageOnDetailsPage(
      rxFacilityName.data.attributes.facilityName,
    );
  });
});
