import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/other-aggregate.json';

// Fresh E2E spec validating that an unknown vital type still renders as an "Other" card
// following the same interaction pattern as other accelerated vitals specs.
// NOTE: Fixture date should be in the selected month/year window for reliability.

describe('Medical Records Vitals Other Records Aggregation (Accelerated)', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Shows Other records card with aggregated unknown vitals', () => {
    site.loadPage();
    Vitals.goToVitalPage();

    // Align timeframe with fixture date (January 2014)
    Vitals.selectMonthAndYear({ month: '1', year: 2014 });
    Vitals.verifySelectedDate({ dateString: 'January 2014' });

    // Assert aggregated card header
    cy.contains('h2', 'Other records').should('be.visible');

    // Scope to OTHER card container via display name test id
    cy.get('[data-testid="vital-other-display-name"]').should('be.visible');

    // Underlying unknown vital names list (inside OTHER card)
    cy.get('[data-testid="vital-other-display-name"]')
      .parents('[data-testid="record-list-item"]')
      .within(() => {
        cy.contains('Custom Unknown Vital A').should('be.visible');
        cy.contains('Custom Unknown Vital B').should('be.visible');
        cy.get('[data-testid="vital-other-measurement"]').contains('55 arb');
        cy.get('[data-testid="vital-other-date-timestamp"]').contains(
          'January 2, 2014',
        );
        // Ensure no review link for OTHER aggregate card
        cy.get('[data-testid="vital-other-review-over-time"]').should(
          'not.exist',
        );
      });

    // Ensure known temperature card still appears separately
    cy.get('[data-testid="vital-temperature-measurement"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
