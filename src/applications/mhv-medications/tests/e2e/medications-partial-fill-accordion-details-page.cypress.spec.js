import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import partialRxList from './fixtures/partial-refills-med-list.json';
import MedicationsListPage from './pages/MedicationsListPage';
import partialRxDetails from './fixtures/partial-prescription-details.json';
import { Data } from './utils/constants';

describe('Medications Partial Fill on Details Page', () => {
  it('visits prescription partial fill refill accordion details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 2;
    site.login();
    listPage.visitMedicationsListPageURL(partialRxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(partialRxDetails, cardNumber);
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyRefillAccordionHeaderForPartialFillOnDetailsPage(
      'Partial fill',
      Data.DATE_EMPTY,
    );
    detailsPage.verifyPartialFillTextInRefillAccordionOnDetailsPage(
      Data.PARTIAL_FILL_TEXT,
    );
    detailsPage.verifyQuantityForPartialFillOnDetailsPage(Data.QUANTITY_EMPTY);
    detailsPage.verifyImageFieldInAccordionCardInfoOnDetailsPage(
      Data.IMAGE_FIELD,
    );
    detailsPage.verifyMedicationDescriptionFieldInAccordionCardInfo(
      Data.MED_DESCRIPTION,
    );
    detailsPage.verifyNoImageFieldMessageOnDetailsPage(Data.IMAGE_EMPTY);
  });
});
