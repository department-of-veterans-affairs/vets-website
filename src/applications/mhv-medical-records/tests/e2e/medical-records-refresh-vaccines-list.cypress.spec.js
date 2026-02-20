import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import Vaccines from './accelerated/pages/Vaccines';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';
import vaccinesData from './accelerated/fixtures/vaccines/sample-lighthouse.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles();
  });

  it('Visits Medical Records View Vaccine List', () => {
    Vaccines.setIntercepts({ vaccinesData });

    site.loadPage();
    Vaccines.goToVaccinesPage();

    cy.reload();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
