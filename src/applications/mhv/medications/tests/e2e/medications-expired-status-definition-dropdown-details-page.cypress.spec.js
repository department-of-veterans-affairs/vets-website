import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import expiredRx from './fixtures/expired-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Expired Status DropDown', () => {
  it('visits Medications Details Page Expired Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(expiredRx);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyExpiredStatusDropDownDefinition();
  });
});
