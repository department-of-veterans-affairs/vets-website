import { appName, rootUrl } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';

import user from '../../fixtures/user.json';

describe(`${appName} -- Welcome message`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
  });

  describe('default user', () => {
    it('renders the Welcome component', () => {
      cy.login(user);
      cy.visit(rootUrl);
      cy.findByRole('heading', { level: 2, name: /^Welcome/ });
      cy.injectAxeThenAxeCheck();
    });
  });
});
