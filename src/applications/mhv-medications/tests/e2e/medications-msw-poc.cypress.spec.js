/**
 * Proof of Concept: MSW integration with Cypress
 * This test demonstrates using MSW scenarios instead of cy.intercept for data mocking
 */
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';

describe('Medications - MSW POC', () => {
  beforeEach(() => {
    // Start MSW worker
    cy.startMsw();
    
    // Login (this still uses cy.intercept internally, which is fine)
    cy.login();
    
    // Load MSW scenario for medications
    cy.loadMswScenario([
      ...scenarios.user.authenticated(),
      ...scenarios.medications.withActiveRx({ count: 5 }),
    ]);
  });

  afterEach(() => {
    // Reset handlers after each test
    cy.resetMsw();
  });

  it('displays medications list using MSW handlers', () => {
    cy.visit('/my-health/medications');
    
    // Wait for medications to load
    cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should('exist');
    
    // Verify we have medications displayed
    cy.get('[data-testid="rx-card"]').should('have.length.at.least', 1);
  });

  it('displays empty state when no medications', () => {
    // Override with empty scenario for this test
    cy.loadMswScenario([
      ...scenarios.medications.empty(),
    ]);
    
    cy.visit('/my-health/medications');
    
    // Wait for page to load and verify empty state
    cy.contains('You don't have any', { timeout: 10000 }).should('be.visible');
  });

  it('handles prescription details page', () => {
    cy.visit('/my-health/medications');
    
    // Wait for and click first prescription
    cy.get('[data-testid="rx-card"]', { timeout: 10000 })
      .first()
      .find('a')
      .first()
      .click();
    
    // Verify details page loads
    cy.url().should('include', '/prescription/');
    cy.get('[data-testid="rx-details"]', { timeout: 10000 }).should('exist');
  });

  it('demonstrates cy.intercept for network-level assertion (spy pattern)', () => {
    // Use cy.intercept as a SPY (not a stub) to assert network behavior
    // MSW provides the data, cy.intercept just observes
    cy.intercept('GET', '/my_health/v1/prescriptions*').as('prescriptions');
    
    cy.visit('/my-health/medications');
    
    // Wait for request and assert it was made with correct params
    cy.wait('@prescriptions').then(interception => {
      expect(interception.request.url).to.include('my_health/v1/prescriptions');
      // Can assert on headers, query params, etc.
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it('demonstrates error handling scenario', () => {
    // Load error scenario
    cy.loadMswScenario([
      ...scenarios.medications.error(500),
    ]);
    
    cy.visit('/my-health/medications');
    
    // Verify error message is displayed
    cy.contains('error', { timeout: 10000, matchCase: false }).should('be.visible');
  });

  it('demonstrates refillable prescriptions scenario', () => {
    cy.loadMswScenario([
      ...scenarios.medications.withRefillable(3),
    ]);
    
    cy.visit('/my-health/medications/refill');
    
    // Verify refillable prescriptions are shown
    cy.get('[data-testid="refillable-rx"]', { timeout: 10000 }).should('exist');
  });
});

describe('Medications - MSW vs cy.intercept comparison', () => {
  it('OLD WAY: using cy.intercept with fixture', () => {
    cy.login();
    
    // OLD: manually intercept with fixture data
    cy.intercept('GET', '/my_health/v1/prescriptions*', {
      fixture: 'prescriptions.json',
    }).as('prescriptions');
    
    cy.visit('/my-health/medications');
    cy.wait('@prescriptions');
    
    cy.get('[data-testid="rx-card"]').should('exist');
  });

  it('NEW WAY: using MSW scenario', () => {
    cy.startMsw();
    cy.login();
    
    // NEW: load reusable scenario
    cy.loadMswScenario([
      ...scenarios.user.authenticated(),
      ...scenarios.medications.withActiveRx(),
    ]);
    
    cy.visit('/my-health/medications');
    
    cy.get('[data-testid="rx-card"]', { timeout: 10000 }).should('exist');
  });
});
