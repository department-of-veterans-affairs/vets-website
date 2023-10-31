import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('show indicator when there are unread messages', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
      ApiInitializer.initializeUserData.withDefaultUser();
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is shown when there are unread messages', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      LandingPage.unreadMessageIndicator().should('be.visible');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is not shown when there are no unread messages', () => {
      ApiInitializer.initializeMessageData.withNoUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      LandingPage.unreadMessageIndicator().should('not.exist');
    });
  });
});
