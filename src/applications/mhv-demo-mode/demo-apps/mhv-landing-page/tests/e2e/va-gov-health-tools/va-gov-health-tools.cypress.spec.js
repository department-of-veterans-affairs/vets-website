import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { HEALTH_TOOLS } from '../../../constants';

describe(`${appName} -- VA.gov Health Tools feature`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    LandingPage.visit();
  });

  HEALTH_TOOLS.forEach(({ name, links }) => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it(`displays a ${name} h2 heading and links`, () => {
      const heading = {
        level: 2,
        name,
      };
      cy.findByRole('heading', heading).should.exist;
      links.forEach(({ text, href }) => {
        const startsWithText = new RegExp(`^${text}`);
        cy.findByRole('link', { name: startsWithText }).should(
          'have.attr',
          'href',
          href,
        );
      });
    });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
