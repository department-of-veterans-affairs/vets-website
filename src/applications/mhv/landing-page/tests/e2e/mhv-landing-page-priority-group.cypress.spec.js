import { appName, rootUrl } from '../../manifest.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import featureToggles from '../fixtures/feature-toggles.json';
import priorityGroupDisabled from '../fixtures/feature-toggles.priority-group-disabled.json';
import user from '../fixtures/user.json';
import hcaEs from '../fixtures/hca-es.json';

describe(`${appName} -- Priority Group`, () => {
  describe('feature enabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
        'featureToggles',
      );
      const hcaEsPath = '/v0/health_care_applications/enrollment_status';
      cy.intercept('GET', hcaEsPath, hcaEs).as('hcaEs');
    });

    it('renders the priority group', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.wait(['@vamcEhr', '@featureToggles', '@hcaEs']);
      cy.injectAxeThenAxeCheck();
      cy.get('[data-testid=mhv-priority-group')
        .should('be.visible')
        .and('include.text', 'Your healthcare priority group: 3');
    });
  });

  describe('feature disabled', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      cy.intercept('GET', '/v0/feature_toggles*', priorityGroupDisabled).as(
        'featureToggles',
      );
    });

    it('does not render the priority group', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.wait(['@vamcEhr', '@featureToggles']);
      cy.injectAxeThenAxeCheck();
      cy.get('[data-testid=mhv-priority-group').should('not.exist');
    });
  });
});
