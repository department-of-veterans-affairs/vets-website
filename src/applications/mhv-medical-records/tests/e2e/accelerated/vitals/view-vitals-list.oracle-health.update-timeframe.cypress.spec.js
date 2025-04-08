import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();

    Vitals.goToVitalPage();

    const today = new Date();
    const timeFrame = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    Vitals.checkUrl({ timeFrame });

    Vitals.selectMonthAndYear({
      month: 'January',
      year: '2020',
    });
    Vitals.checkUrl({ timeFrame: '2020-01' });

    cy.injectAxeThenAxeCheck();

    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").should('not.be.empty');

    cy.get('[data-testid="vital-blood-pressure-review-over-time"]')
      .should('be.visible')
      .click();

    Vitals.checkUrl({ timeFrame: '2020-01' });

    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .should('have.attr', 'href')
      .and('include', '/vitals?timeFrame=2020-01');

    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .contains('Back')
      .click();

    // Maintaining the same timeFrame across page clicks
    Vitals.checkUrl({ timeFrame: '2020-01' });
  });
});
