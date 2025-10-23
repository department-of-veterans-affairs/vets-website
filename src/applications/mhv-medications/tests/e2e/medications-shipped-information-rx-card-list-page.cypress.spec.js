import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Shipped On Information', () => {
  it('visits Medications List Shipped Information on Rx Card', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    const shippedDate = 'September 24, 2023';
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');

    cy.wait('@Medications').then(interception => {
      expect(interception.response.body.data[15].attributes).to.include({
        dispensedDate: shippedDate,
      });
    });
    listPage.verifyShippedOnInformationOnRxCardOnMedicationsListPage(
      shippedDate,
    );
  });
});
