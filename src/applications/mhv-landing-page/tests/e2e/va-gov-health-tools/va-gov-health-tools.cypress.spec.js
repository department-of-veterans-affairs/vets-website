import { appName, rootUrl } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import { generateFeatureToggles } from '../../../mocks/api/feature-toggles';
import ApiInitializer from '../utilities/ApiInitializer';

import { HEALTH_TOOLS, HEALTH_TOOL_HEADINGS } from '../../../constants';

describe(`${appName} -- VA.gov Health Tools feature`, () => {
  beforeEach(() => {
    const featureToggles = generateFeatureToggles({
      mhvLandingPageEnableVaGovHealthToolsLinks: true,
    });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
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
          cy.findByRole('link', { name: text }).should(
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
