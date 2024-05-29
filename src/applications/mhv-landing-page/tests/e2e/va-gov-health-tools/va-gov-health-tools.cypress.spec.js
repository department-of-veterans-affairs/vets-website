import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { HEALTH_TOOLS, HEALTH_TOOL_HEADINGS } from '../../../constants';

describe(`${appName} -- VA.gov Health Tools feature`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    LandingPage.visit();
  });

  HEALTH_TOOLS.forEach(({ name, links }) => {
    if (name === HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS) {
      it.skip(
        `${name} skipped until mhvMedicalRecordsToVaGovRelease feature toggle enabled`,
      );
    } else {
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
    }
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
