import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Bottom Part is Visible', () => {
  it('visits Medications List Page Bottom Section when list page loads', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyMedicationsListPageTitle();
    listPage.verifyMedicationsListPageTitleIsFocused();
    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
  });
});
