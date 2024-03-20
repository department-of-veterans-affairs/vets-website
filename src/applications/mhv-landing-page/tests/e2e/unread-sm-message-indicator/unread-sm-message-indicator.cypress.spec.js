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
    it('indicator is shown when there are unread messages and user has an MHV account', () => {
      ApiInitializer.initializeUserData.withMHVAccountState('OK');
      ApiInitializer.initializeMessageData.withUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      getUnreadLink().should('be.visible');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is not shown when there are no unread messages and user does not have an MHV', () => {
      ApiInitializer.initializeUserData.withMHVAccountState('NONE');
      ApiInitializer.initializeMessageData.withNoUnreadMessages();

      LandingPage.visitPage();
      LandingPage.validatePageLoaded();

      getUnreadLink().should('not.exist');
    });
  });
});
