import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import rxDescriptionDetails from './fixtures/prescription-facility-name-details-page.json';

describe('Medications List Page DropDown', () => {
  it('visits Medications List Page DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyMedicationDescriptionDetails(
      rxDescriptionDetails.data.attributes.shape,
      rxDescriptionDetails.data.attributes.color,
      rxDescriptionDetails.data.attributes.frontImprint,
      rxDescriptionDetails.data.attributes.backImprint,
    );
  });
});
