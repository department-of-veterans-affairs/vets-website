import { appName, rootUrl } from '../../manifest.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import featureToggles from '../fixtures/feature-toggles.json';
import user from '../fixtures/user.json';
import cernerUser from '../fixtures/user.cerner.json';
import noFacilitiesUser from '../fixtures/user.no-facilities.json';

describe(`${appName} -- Auth Redirect`, () => {
  before(() => {
    // redirectUrl is dependent upon SSOe and environment. Currently failing
    // stress tests (with environment.BUILDTYPE === 'vagovprod').
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    const redirectUrl = 'https://pint.eauth.va.gov/mhv-portal-web/eauth';
    cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
  });

  describe('unauthenticated user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('prompts user to authenticate, redirecting to /my-health', () => {
      cy.visit(rootUrl);
      cy.get('#signin-signup-modal').should('be.visible');
      cy.url().should('contain', '?next=%2Fmy-health');
    });
  });

  describe('default user', () => {
    it('renders the landing page', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.get('h1').should('include.text', 'My HealtheVet');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Cerner patient', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to MHV National Portal', () => {
      cy.login(cernerUser);
      cy.visit(rootUrl);
      cy.wait('@mhvRedirect');
    });
  });

  describe('unauthorized user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to MHV National Portal', () => {
      cy.login(noFacilitiesUser);
      cy.visit(rootUrl);
      cy.wait('@mhvRedirect');
    });
  });
});
