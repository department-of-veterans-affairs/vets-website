import MedicationsSite from './med_site/MedicationsSite';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import olderRxDetails from './fixtures/older-prescription-details.json';
import { Data } from './utils/constants';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Details Page Request Refill Link', () => {
  it('visits Medications Details Page Original Fill Link Text', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(olderRxDetails, 2);
    detailsPage.verifyRefillLinkTextOnDetailsPage(Data.ORIGINAL_FILL_LINK_TEXT);
  });
});
