import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Notes About Image', () => {
  it('visits Medications Details Page Notes About Image', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.verifyNotesAboutPrescriptionImagesOnDetailsPage(
      Data.NOTE_ABOUT_IMAGES,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
