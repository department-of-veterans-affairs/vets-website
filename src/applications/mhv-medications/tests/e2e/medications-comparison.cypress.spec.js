/**
 * Side-by-side comparison: cy.intercept vs MSW
 * This demonstrates the migration path and benefits
 */
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsSiteMSW from './helpers/MedicationsSiteMSW';
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';

describe('Medications - cy.intercept vs MSW Comparison', () => {
  describe('OLD: Using cy.intercept with fixtures', () => {
    const site = new MedicationsSite();

    it('loads medications list with cy.intercept', () => {
      // Uses cy.intercept internally with hard-coded fixtures
      site.login();
      cy.visit('/my-health/medications');
      
      cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should('exist');
    });
  });

  describe('NEW: Using MSW with scenarios', () => {
    const site = new MedicationsSiteMSW();

    afterEach(() => {
      site.cleanup();
    });

    it('loads medications list with MSW', () => {
      // Uses MSW with reusable scenarios
      site.visitMedicationsListPage();
      
      cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should('exist');
    });

    it('customizes medication count easily', () => {
      site.visitMedicationsListPage({ prescriptionCount: 3 });
      
      cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should(
        'have.length',
        3,
      );
    });

    it('tests empty state without creating fixture', () => {
      site.login();
      site.loadEmptyScenario();
      cy.visit('/my-health/medications');
      
      cy.contains('You don't have any', { timeout: 10000 }).should('be.visible');
    });

    it('tests error state with different status codes', () => {
      site.login();
      site.loadErrorScenario(500);
      cy.visit('/my-health/medications');
      
      cy.contains('error', { timeout: 10000, matchCase: false }).should(
        'be.visible',
      );
    });
  });

  describe('HYBRID: MSW for data, cy.intercept for assertions', () => {
    const site = new MedicationsSiteMSW();

    afterEach(() => {
      site.cleanup();
    });

    it('uses MSW for mocking and cy.intercept for spying', () => {
      site.login();
      
      // Use cy.intercept as a SPY (not a stub)
      cy.intercept('GET', '/my_health/v1/prescriptions*').as('prescriptions');
      
      cy.visit('/my-health/medications');
      
      // Assert the request was made
      cy.wait('@prescriptions').then(interception => {
        expect(interception.request.url).to.include('prescriptions');
        expect(interception.response.statusCode).to.equal(200);
        
        // Verify query parameters
        const url = new URL(interception.request.url);
        expect(url.searchParams.get('page')).to.exist;
      });
      
      cy.get('[data-testid="rx-card"]').should('exist');
    });

    it('asserts on request headers', () => {
      site.login();
      
      cy.intercept('GET', '/my_health/v1/prescriptions*').as('prescriptions');
      
      cy.visit('/my-health/medications');
      
      cy.wait('@prescriptions').then(interception => {
        // Assert headers without stubbing response
        expect(interception.request.headers).to.have.property('accept');
      });
    });

    it('counts number of API calls', () => {
      site.login();
      
      let callCount = 0;
      cy.intercept('GET', '/my_health/v1/prescriptions*', req => {
        callCount += 1;
        // Don't provide a response - let MSW handle it
      }).as('prescriptions');
      
      cy.visit('/my-health/medications');
      
      cy.wait('@prescriptions').then(() => {
        expect(callCount).to.be.greaterThan(0);
      });
    });
  });

  describe('Benefits Demonstration', () => {
    const site = new MedicationsSiteMSW();

    afterEach(() => {
      site.cleanup();
    });

    it('reuses scenarios across tests easily', () => {
      // Same scenario can be used in unit tests, E2E, and local dev
      site.login();
      cy.loadMswScenario([
        ...scenarios.medications.withRefillable(5),
      ]);
      
      cy.visit('/my-health/medications/refill');
      
      cy.get('[data-testid="refillable-rx"]', { timeout: 10000 }).should('exist');
    });

    it('changes scenarios mid-test', () => {
      site.visitMedicationsListPage({ prescriptionCount: 5 });
      
      cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should(
        'have.length',
        5,
      );
      
      // Change to error scenario
      site.loadErrorScenario(404);
      
      // Trigger a refetch (implementation-dependent)
      cy.reload();
      
      cy.contains('error', { timeout: 10000, matchCase: false }).should(
        'be.visible',
      );
    });

    it('tests loading states with slow scenario', () => {
      site.login();
      site.loadSlowScenario();
      
      cy.visit('/my-health/medications');
      
      // Should show loading indicator
      cy.get('va-loading-indicator', { timeout: 1000 }).should('be.visible');
      
      // Eventually loads
      cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should('exist');
    });
  });
});
