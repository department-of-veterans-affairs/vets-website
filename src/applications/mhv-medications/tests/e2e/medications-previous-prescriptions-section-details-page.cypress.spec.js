import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import olderRxDetails from './fixtures/older-prescription-details.json';
import { Data } from './utils/constants';

describe('Medications Details Page Grouping', () => {
  it('visits Medications Details Page Grouping Pagination', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(olderRxDetails, 2);
    detailsPage.verifyPreviousPrescriptionHeaderTextOnDetailsPage(
      'Previous prescriptions',
    );
    detailsPage.verifyPreviousPrescriptionsPaginationTextOnDetailsPage(
      Data.PREVIOUS_PRESCRIPTION_PAGINATION,
    );
    detailsPage.clickNextButtonForPreviousPrescriptionPagination();
    detailsPage.verifyPaginationTextIsFocusedAfterClickingNext(
      Data.PREVIOUS_PRESCRIPTION_PAGINATION_SECOND,
    );
    detailsPage.clickNextButtonForPreviousPrescriptionPagination();
    detailsPage.verifyPaginationTextIsFocusedAfterClickingNext(
      Data.PREVIOUS_PRESCRIPTION_PAGINATION_THIRD,
    );
  });
});
