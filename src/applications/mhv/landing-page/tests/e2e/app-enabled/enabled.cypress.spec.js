import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import featureToggles from '../../fixtures/feature-toggles.json';
import user from '../../fixtures/user.json';

describe(appName, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as('featureToggles');
    const redirectUrl = 'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home';
    cy.intercept('GET', redirectUrl, '').as('redirect');
  });

  it('landing page is enabled', () => {
    cy.login(user);
    cy.visit('/my-health/');
    // cy.wait('@mockUser');
    cy.get('h1').should('be.visible').and('have.text', 'My HealtheVet');
    cy.url().should('include', '/my-health/');
    cy.injectAxeThenAxeCheck();
  });
});
