import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('show indicator when there are unread messages', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withDefaultUser();
    });

    const getUnreadLink = () =>
      cy.findByRole('link', {
        name: /You have unread messages. Go to your inbox/i,
      });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is shown when there are unread messages', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      getUnreadLink().should('be.visible');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is not shown when there are no unread messages', () => {
      ApiInitializer.initializeMessageData.withNoUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      getUnreadLink().should('not.exist');
    });
  });
});
