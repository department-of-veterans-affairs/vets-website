import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page No ToolTip After Closing and Reloading', () => {
  it('visits Medications List Page ToolTip Not Visible', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickStopShowingThisHintLinkOnListPage();
    listPage.verifyToolTipNotVisibleOnListPage();
    listPage.loadListPageWithoutToolTip();
    listPage.verifyToolTipNotVisibleOnListPage();
  });
});
