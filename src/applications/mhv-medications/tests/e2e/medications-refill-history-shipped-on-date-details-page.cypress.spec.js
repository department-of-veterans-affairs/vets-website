import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import refillHistoryDetails from './fixtures/prescription-tracking-details.json';
import olderRxDetails from './fixtures/older-prescription-details.json';
import medicationsList from './fixtures/grouped-prescriptions-list.json';
import { Data } from './utils/constants';

describe('Medications Refill History Shipped On Latest Refill', () => {
  it('visits prescription refill history Shipped on date', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    const shippedDate = 'Sun, 24 Sep 2023 04:39:11 EDT';
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(refillHistoryDetails, cardNumber);
    detailsPage.verifyRefillHistoryHeaderOnDetailsPage();
    detailsPage.verifyFirstRefillHeaderTextOnDetailsPage();
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyShippedOnDateFieldOnDetailsPage();
    cy.get('@Medications')
      .its('response')
      .then(res => {
        expect(res.body.data[15].attributes.trackingList[0]).to.include({
          completeDateTime: shippedDate,
        });
      });
  });

  it('visits prescription refill history no shipping date available ', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 3;
    site.login();
    listPage.visitMedicationsListPageURL(medicationsList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(olderRxDetails, cardNumber);
    detailsPage.clickRefillHistoryAccordionOnDetailsPage();
    detailsPage.verifyShippedOnDateFieldOnDetailsPage();
    detailsPage.verifyShippedOnDateNotAvailableTextInRefillAccordion(
      Data.DATE_EMPTY,
    );
  });
});
