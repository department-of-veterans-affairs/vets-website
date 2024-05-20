import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Non-VA presciption on List Page', () => {
  it('visits non-VA prescription on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyNonVAPrescriptionNameOnListPage();
  });
});
