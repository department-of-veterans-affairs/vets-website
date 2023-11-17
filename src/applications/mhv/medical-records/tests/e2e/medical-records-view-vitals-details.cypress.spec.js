import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';

describe('Medical Records View Vitals', () => {
  it('Visits Medical Records View Vitals List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/vitals');

    VitalsListPage.clickVitalsDetailsLink(0);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
