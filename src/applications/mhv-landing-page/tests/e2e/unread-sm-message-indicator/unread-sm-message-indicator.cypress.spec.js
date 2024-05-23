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

      LandingPage.visitPage({ mhvAccountState: 'OK' });
      LandingPage.validatePageLoaded();

      getUnreadLink().should('be.visible');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not render when no unread messages', () => {
      ApiInitializer.initializeMessageData.withNoUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      getUnreadLink().should('not.exist');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('does not render when no MHV account', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();

      LandingPage.visitPage({ mhvAccountState: 'NONE' });
      LandingPage.validatePageLoaded();

      getUnreadLink().should('not.exist');
    });
  });
});
