import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import emptyFieldRx from './fixtures/empty-field-prescription-details.json';
import { Data } from './utils/constants';

describe('Medications Details Page Empty Field Refill History', () => {
  it('visits Medications Details Empty Field Content Refill History', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(emptyFieldRx, 5);
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyAccordionExpandedOnDetailsPage();
    detailsPage.verifyShippedOnDateFieldOnDetailsPage(Data.SHIPPED_ON_EMPTY);
    detailsPage.verifyMedDescriptionFieldInRefillAccordionDetailsPage(
      Data.MEDICATION_DESCRIPTION_EMPTY,
    );
  });
});
