/**
 * MSW-based Medications Site Helper (POC)
 * Demonstrates migrating from cy.intercept to MSW scenarios
 */
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';

class MedicationsSiteMSW {
  /**
   * Login with MSW scenarios instead of cy.intercept
   * @param {object} options - Configuration options
   */
  login = (options = {}) => {
    const {
      isMedicationsUser = true,
      prescriptionCount = 10,
      refillableCount = 5,
    } = options;

    // Start MSW worker
    cy.startMsw();

    if (isMedicationsUser) {
      // Load user and medications scenarios
      cy.loadMswScenario([
        ...scenarios.user.authenticated(),
        ...scenarios.medications.withActiveRx({
          count: prescriptionCount,
          refillableCount,
        }),
      ]);

      // cy.login() still uses its own mocking, which is fine
      cy.login();
    } else {
      cy.loadMswScenario([...scenarios.user.unauthenticated()]);
      window.localStorage.setItem('isLoggedIn', false);
    }
  };

  /**
   * Login as Cerner user
   */
  cernerLogin = () => {
    cy.startMsw();
    cy.loadMswScenario([
      ...scenarios.user.cernerUser(),
      ...scenarios.medications.empty(),
    ]);
    cy.login();
  };

  /**
   * Login with specific feature toggles
   */
  loginWithFeatureToggles = (toggles = {}) => {
    cy.startMsw();
    cy.loadMswScenario([
      ...scenarios.user.withToggles(toggles),
      ...scenarios.medications.withActiveRx(),
    ]);
    cy.login();
  };

  /**
   * Visit medications list page with MSW data
   */
  visitMedicationsListPage = (options = {}) => {
    this.login(options);
    cy.visit('/my-health/medications');
    cy.injectAxe();
    cy.axeCheck('main');
  };

  /**
   * Visit refill page with MSW data
   */
  visitRefillPage = (options = {}) => {
    this.login(options);
    cy.loadMswScenario([
      ...scenarios.medications.withRefillable(options.refillableCount || 5),
    ]);
    cy.visit('/my-health/medications/refill');
  };

  /**
   * Load error scenario
   */
  loadErrorScenario = (statusCode = 500) => {
    cy.loadMswScenario([...scenarios.medications.error(statusCode)]);
  };

  /**
   * Load empty medications scenario
   */
  loadEmptyScenario = () => {
    cy.loadMswScenario([...scenarios.medications.empty()]);
  };

  /**
   * Load slow response scenario (for loading state testing)
   */
  loadSlowScenario = () => {
    cy.loadMswScenario([...scenarios.medications.slow()]);
  };

  /**
   * Cleanup after test
   */
  cleanup = () => {
    cy.resetMsw();
  };
}

export default MedicationsSiteMSW;
