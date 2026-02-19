import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vaccines from '../pages/Vaccines';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vaccinesData from '../fixtures/vaccines/sample-lighthouse-empty.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles();
    Vaccines.setIntercepts({ vaccinesData });
  });

  it('Visits Medical Records View Vaccine List', () => {
    site.loadPage();

    Vaccines.goToVaccinesPage();

    cy.injectAxeThenAxeCheck();

    cy.get('[data-testid="no-records-message"]').should('be.visible');
    cy.get('[data-testid="print-download-menu"]').should('not.exist');
  });
});
