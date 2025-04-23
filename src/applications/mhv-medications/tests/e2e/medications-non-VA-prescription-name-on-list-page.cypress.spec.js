import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';

import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Non-VA presciption on List Page', () => {
  it('visits non-VA prescription on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyNonVAPrescriptionNameOnListPage();
  });
});
