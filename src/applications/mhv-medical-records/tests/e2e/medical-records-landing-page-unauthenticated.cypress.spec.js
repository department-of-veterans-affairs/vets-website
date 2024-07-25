import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import VitalsDetailsPage from './pages/VitalsDetailsPage';

import nonMrUser from './fixtures/non_mr_user.json';

describe.skip('Medical Records Unauthenticated Users', () => {
  it('Visits Medical Records Unauthenticated Users', () => {
    const site = new MedicalRecordsSite();
    // Unauthenticated users implement visibility restrictions
    site.login(nonMrUser);
    site.loadPage();
    cy.url().should('contain', 'health-care/get-medical-records');
    cy.visit('my-health/medical-records');

    // Authenticated users
    /*
    site.login();
    cy.visit('my-health/medical-records/vitals');
    // Verify "Vitals" Page title Text
    VitalsDetailsPage.verifyVitalsPageText('Vitals');
    */
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
