import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';
import { aboutVAHeaders, aboutVALinks } from './about-va-links';

describe('global header', () => {
  const verifyElement = selector =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible');

  const verifyLinkWithoutSelector = (index, text, href) =>
    cy
      .get('a')
      .eq(index)
      .should('be.visible')
      .should('contain.text', text)
      .should('have.attr', 'href')
      .and('include', href);

  const clickButton = selector => cy.get(selector).click();

  Cypress.config({
    includeShadowDom: true,
    waitForAnimations: true,
    pageLoadTimeout: 120000,
  });

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('/v0/maintenance_windows', {
      data: [],
    }).as('maintenanceWindows');
    cy.intercept('POST', 'https://www.google-analytics.com/*', {}).as(
      'analytics',
    );
  });

  const verifyAboutVALinks = staticLinks => {
    for (const link of aboutVALinks) {
      h.verifyLink(`[data-e2e-id*="${link.id}"]`, link.text, link.href);

      const staticLink = staticLinks?.filter(
        hardCodedLink => hardCodedLink.text === link.text,
      )[0];

      if (!staticLink) {
        throw new Error(
          `Unable to find a matching link in header-footer-data.json for ${
            link.text
          }`,
        );
      }

      if (staticLink?.href !== link.href || staticLink?.text !== link.text) {
        throw new Error(
          `Link attributes for ${
            link.text
          } do not match those in header-footer-data.json`,
        );
      }
    }
  };

  const verifyAboutVAHeaders = staticHeaders => {
    for (const header of aboutVAHeaders) {
      h.verifyText(header.id, header.text);

      const staticHeader = staticHeaders?.filter(head => head === header.text);

      if (!staticHeader?.length) {
        throw new Error(
          `Unable to find a matching header in header-footer-data.json for ${header}`,
        );
      }
    }
  };

  const verifyAboutVAMenu = () => {
    const aboutVAButton = '[data-e2e-id="about-va-1"]';

    verifyElement(aboutVAButton);
    clickButton(aboutVAButton);

    const staticColumnsData = h.getStaticColumnsDataForAboutVA();
    const staticLinks = Object.keys(staticColumnsData)
      .map(columnData => staticColumnsData[columnData]?.links)
      .flat();

    verifyAboutVALinks(staticLinks);

    const staticHeaders = Object.keys(staticColumnsData).map(
      columnData => staticColumnsData[columnData]?.title,
    );

    verifyAboutVAHeaders(staticHeaders);
  };

  it('should correctly load all of the header elements', () => {
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    verifyElement('.header');

    const header = () => cy.get('.header');

    header()
      .scrollIntoView()
      .within(() => {
        verifyElement('.va-header-logo-wrapper');
        verifyElement('.sitewide-search-drop-down-panel-button');
        verifyLinkWithoutSelector(1, 'Contact us', '/contact-us');
        verifyElement('.sign-in-nav');
        verifyElement('#vetnav');
        verifyElement('.va-crisis-line');

        const vaBenefitsAndHealthCareButton =
          '[data-e2e-id="va-benefits-and-health-care-0"]';

        verifyElement(vaBenefitsAndHealthCareButton);
        clickButton(vaBenefitsAndHealthCareButton);

        // Benefit hub menus with links are tested in separate files in this directory

        // -> Service member benefits
        h.verifyLink(
          '[data-e2e-id="vetnav-level2--service-member-benefits"]',
          'Service member benefits',
          '/service-member-benefits',
        );

        // -> Family member benefits
        h.verifyLink(
          '[data-e2e-id="vetnav-level2--family-member-benefits"]',
          'Family member benefits',
          '/family-member-benefits',
        );

        verifyAboutVAMenu();

        verifyElement('[data-e2e-id="find-a-va-location-2"]');
        verifyElement('[data-e2e-id="my-va-3"]');
      });
  });
});
