import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import submittedRx from './fixtures/active-submitted-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Active Submmitted Status DropDown', () => {
  it('visits Medications Details Page Active Submitted Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(submittedRx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.verifySubmittedStatusDropDownDefinition();
  });
});
