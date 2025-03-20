import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import olderRxDetails from './fixtures/older-prescription-details.json';
import { Data } from './utils/constants';

describe('Medications Details Page Refill Prescription Link', () => {
  it('visits Medications Details Page Grouping Refill Link Text', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(olderRxDetails, 1);
    detailsPage.verifyLastFilledDateOnDetailsPage(Data.LAST_FILLED_DATE);
    detailsPage.verifyRefillLinkTextOnDetailsPage(Data.REFILL_LINK_TEXT);
  });
});
