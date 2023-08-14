import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import featureTogglesDisabled from '../../fixtures/feature-toggles.disabled.json';
import user from '../../fixtures/user.json';

describe(appName, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureTogglesDisabled).as('featureTogglesDisabled');
    const redirectUrl = 'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home';
    cy.intercept('GET', redirectUrl, '').as('redirect');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('landing page is disabled', () => {
    cy.login(user);
    cy.visit('/my-health/');
    cy.url().should('not.include', '/my-health/');
    cy.wait('@redirect');
  });
});
