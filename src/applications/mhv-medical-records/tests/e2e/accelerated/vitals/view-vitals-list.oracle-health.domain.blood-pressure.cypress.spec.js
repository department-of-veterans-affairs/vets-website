import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
// import VitalsListPage from './pages/VitalsListPage';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import vitals from '../../fixtures/vitals/blood-pressure.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply({
        retrievedDate: 1732224967218,
        lastRefreshDate: null,
        facilityExtractStatusList: [
          {
            extract: 'Allergy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ImagingStudy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'VPR',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ChemistryHematology',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
        ],
      });
    });
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      expect(req.url).to.contain('use_oh_data_path=1');
      req.reply(vitals);
    }).as('vitals-list');
  });

  it('Visits View Vitals List', () => {
    // check for MY Va Health links
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="allergies-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="vitals-landing-page-link"]')
      .should('be.visible')
      .click();

    // switch to march 2024
    cy.get('select[name="vitals-date-pickerMonth"]').select('3');
    cy.get('input[name="vitals-date-pickerYear"]').clear();
    cy.get('input[name="vitals-date-pickerYear"]').type('2024');

    // check for latest id
    cy.get('[data-testid="vital-li-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-li-measurement"]').contains('130/81');

    cy.get('[data-testid="vital-li-date"]').should('be.visible');
    cy.get('[data-testid="vital-li-date"]').contains('March 26, 2024');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
