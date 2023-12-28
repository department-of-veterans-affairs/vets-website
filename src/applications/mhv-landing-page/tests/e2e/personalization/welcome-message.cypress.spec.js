import { appName, rootUrl } from '../../../manifest.json';
import { generateFeatureToggles } from '../../../mocks/api/feature-toggles';
import user from '../../fixtures/user.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles()).as(
      'featureToggles',
    );
    const redirectUrl = 'https://**.va.gov/mhv-portal**/**';
    cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
    ApiInitializer.initializeMessageData.withUnreadMessages();
  });

  describe('default user', () => {
    it('renders a Welcome message', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.findByRole('heading', { level: 2, name: /^Welcome/ });
      cy.injectAxeThenAxeCheck();
    });
  });
});
