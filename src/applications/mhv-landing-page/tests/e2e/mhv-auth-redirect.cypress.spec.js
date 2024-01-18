import { appName, rootUrl } from '../../manifest.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import featureToggles from '../fixtures/feature-toggles.json';
import user from '../fixtures/user.json';
import cernerUser from '../fixtures/user.cerner.json';

describe(`${appName} -- Auth Redirect`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    const redirectUrl = 'https://**.va.gov/mhv-portal**/**';
    cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
  });

  describe('unauthenticated user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it.skip('prompts user to authenticate, redirecting to /my-health', () => {
      cy.visit(rootUrl);
      cy.url().should('contain', '?next=%2Fmy-health');
    });
  });

  describe('default user', () => {
    it('renders the landing page', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Cerner patient', () => {
    it('renders the landing page', () => {
      cy.login(cernerUser);
      cy.visit(rootUrl);
      cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;
      cy.injectAxeThenAxeCheck();
    });
  });
});
