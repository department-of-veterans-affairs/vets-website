import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import olderRxDetails from './fixtures/older-prescription-details.json';
import { Data } from './utils/constants';

describe('Medications Details Page Grouping', () => {
  it('visits Medications Details Page Grouping accordion details', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(olderRxDetails, 1);
    detailsPage.verifyRefillHistoryInformationTextOnDetailsPage(
      Data.REFILL_HISTORY_INFO,
    );
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyFilledDateFieldInAccordionCardInfoOnDetailPage(
      Data.FILL_DATE_FIELD,
    );
    detailsPage.verifyImageFieldInAccordionCardInfoOnDetailsPage(
      Data.IMAGE_FIELD,
    );
    detailsPage.verifyShippedOnDateFieldOnDetailsPage();
    detailsPage.verifyMedicationDescriptionFieldInAccordionCardInfo(
      Data.MED_DESCRIPTION,
    );
  });
});
