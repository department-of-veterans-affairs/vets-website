import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Unauthenticated Users', () => {
  it('Visits Medical Records Unauthenticated Users', () => {
    const site = new MedicalRecordsSite();
    // Unauthenticated users implement visibility restrictions
    site.login(false);
    site.loadPageUnauthenticated();
    // Once dev work for MR visibility restrictions has been completed, uncomment the next two lines
    // cy.url().should('contain', 'health-care/get-medical-records');
    // cy.visit ('my-health/medical-records')
    // Once dev work for MR visibility restrictionshas been completed, remove this next line
    cy.url().should('contain', 'my-health/medical-records');

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
