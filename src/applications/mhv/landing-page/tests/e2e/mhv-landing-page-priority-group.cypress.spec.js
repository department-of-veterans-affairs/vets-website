import { appName, rootUrl } from '../../manifest.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import featureToggles from '../fixtures/feature-toggles.json';
import user from '../fixtures/user.json';
import hcaEs from '../fixtures/hca-es.json';

describe(`${appName} -- Priority Group`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    const redirectUrl = 'https://pint.eauth.va.gov/mhv-portal-web/eauth';
    cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
    const hcaEsPath = '/v0/health_care_applications/enrollment_status';
    cy.intercept('GET', hcaEsPath, hcaEs).as('hcaEs');
  });

  describe('default user', () => {
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
});
