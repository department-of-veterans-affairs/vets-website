import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Review Image DropDown', () => {
  it('visits Medications Details Page Review Image Dropdown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails);
    detailsPage.clickReviewImageDropDownOnDetailsPage();
    detailsPage.verifyMedicationImageVisibleOnDetailsPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
