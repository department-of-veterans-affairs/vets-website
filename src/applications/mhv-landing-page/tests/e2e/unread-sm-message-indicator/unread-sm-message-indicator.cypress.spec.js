import manifest from '../../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  describe('show indicator when there are unread messages', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    const getUnreadLink = () =>
      cy.findByRole('link', {
        name: /You have unread messages. Go to your inbox/i,
      });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is shown when there are unread messages and user has an MHV account', () => {
      ApiInitializer.initializeMessageData.withUnreadMessages();

      LandingPage.visitPage({ mhvAccountState: 'OK' });
      LandingPage.validatePageLoaded();

      getUnreadLink().should('be.visible');
    });

    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('indicator is not shown when there are no unread messages and user does not have an MHV', () => {
      ApiInitializer.initializeMessageData.withNoUnreadMessages();

      LandingPage.visitPage({ mhvAccountState: 'NONE' });
      LandingPage.validatePageLoaded();

      getUnreadLink().should('not.exist');
    });
  });
});
