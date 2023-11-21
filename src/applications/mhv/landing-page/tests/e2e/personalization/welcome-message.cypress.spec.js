import { appName, rootUrl } from '../../../manifest.json';
import featureToggles from '../../fixtures/feature-toggles.personalization.json';
import user from '../../fixtures/user.json';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    const redirectUrl = 'https://**.va.gov/mhv-portal**/**';
    cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
  });

  describe('default user', () => {
    it('renders the Welcome component', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.get('h2:first').should('include.text', 'Welcome, HECTOR');
      cy.injectAxeThenAxeCheck();
    });
  });
});
