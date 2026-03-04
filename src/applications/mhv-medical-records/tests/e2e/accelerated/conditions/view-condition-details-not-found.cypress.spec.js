import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Conditions from '../pages/Conditions';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import conditionsData from '../fixtures/conditions/conditions.json';

describe('Medical Records Condition Details - Not Found Redirect', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingConditions: true,
    });
    Conditions.setIntercepts({ conditionsData });
  });

  it('Redirects to conditions list when condition ID is not in the list', () => {
    // Visit the main MR landing page first
    // (Short cut since it has all the user, session, etc. intercepts set up)
    site.loadPage();
    // Then navigate directly to a condition details page with a non-existent ID
    cy.visit('my-health/medical-records/conditions/non-existent-condition-id');

    // Should redirect to the conditions list page
    cy.url().should('include', '/conditions');
    cy.url().should('not.include', 'non-existent-condition-id');
    cy.findAllByTestId('record-list-item').should('be.visible');

    // Accessibility check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
