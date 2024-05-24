import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('the dot', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    const getUnreadLink = () =>
      cy.findByRole('link', {
        name: /You have unread messages. Go to your inbox/i,
      });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('renders', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();
      LandingPage.visit({ mhvAccountState: 'OK' });
      getUnreadLink().should('be.visible');
      cy.injectAxeThenAxeCheck();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not render when no unread messages', () => {
      ApiInitializer.initializeMessageData.withNoUnreadMessages();
      LandingPage.visit();
      getUnreadLink().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not render when no MHV account', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();
      LandingPage.visit({ mhvAccountState: 'NONE' });
      getUnreadLink().should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
