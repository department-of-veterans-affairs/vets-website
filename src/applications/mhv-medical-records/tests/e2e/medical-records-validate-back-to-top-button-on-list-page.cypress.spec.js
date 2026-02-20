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

  it('Visits MR Vaccine List, Uses Back-To-Top Button', () => {
    Vaccines.setIntercepts({ vaccinesData });

    cy.viewport(550, 750);

    site.loadPage();
    Vaccines.goToVaccinesPage();

    cy.scrollTo(0, 1500);
    Vaccines.clickBackToTopButtonOnListPage();
    Vaccines.verifyVaccinesListPageTitleIsFocused();
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
