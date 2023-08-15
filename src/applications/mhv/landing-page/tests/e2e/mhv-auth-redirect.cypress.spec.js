import { appName, rootUrl } from '../../manifest.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import featureToggles from '../fixtures/feature-toggles.json';
import user from '../fixtures/user.json';
import cernerUser from '../fixtures/user.cerner.json';
import noFacilitiesUser from '../fixtures/user.no-facilities.json';

describe(`${appName} -- Auth Redirect`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    const mhvRedirectUrl =
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home';
    cy.intercept('GET', mhvRedirectUrl, '').as('mhvRedirect');
    const mhvAuthRedirectUrl = 'https://pint.eauth.va.gov/mhv-portal-web/eauth';
    cy.intercept('GET', mhvAuthRedirectUrl, '').as('mhvAuthRedirect');
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
      cy.axeCheck();
    });
  });

  describe('Cerner patient', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to MHV National Portal', () => {
      cy.login(cernerUser);
      cy.visit(rootUrl);
      cy.wait('@mhvAuthRedirect');
    });
  });

  describe('unauthorized user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects to MHV National Portal', () => {
      cy.login(noFacilitiesUser);
      cy.visit(rootUrl);
      cy.wait('@mhvAuthRedirect');
    });
  });
});
