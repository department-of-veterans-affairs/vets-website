import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxDescriptionDetails from './fixtures/prescription-facility-name-details-page.json';

describe('Medications List Page DropDown', () => {
  it('visits Medications List Page DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyMedicationDescriptionDetails(
      rxDescriptionDetails.data.attributes.shape,
      rxDescriptionDetails.data.attributes.color,
      rxDescriptionDetails.data.attributes.frontImprint,
      rxDescriptionDetails.data.attributes.backImprint,
    );
  });
});
