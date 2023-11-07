/* eslint-disable no-param-reassign */
import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as h from '../../../../utilities/tests/header-footer/utilities/helpers';
import * as mockHeaderFooterData from '~/platform/landing-pages/header-footer-data.json';

describe('global header - about va', () => {
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

    // The header data is set in window.VetsGov.headerFooter with the data received
    // from content-build. It's mocked here with header-footer-data.json
    cy.visit('/', {
      onBeforeLoad(win) {
        win.VetsGov = {};
        win.VetsGov.headerFooter = mockHeaderFooterData;
      },
    });
  });

  const verifyAboutVALinks = (links = null) => {
    for (const [index, link] of links.entries()) {
      h.verifyLinkWithoutSelector(index, link.text, link.href);
    }
  };

  const verifyAboutVADesktopMenu = () => {
    const aboutVAButton = '[data-e2e-id="about-va-1"]';

    h.clickButton(aboutVAButton);

    const navContainer = () => cy.get('#vetnav-about-va');

    navContainer()
      .scrollIntoView()
      .within(() => {
        const columnsData = h.getColumnsDataForAboutVA();
        const links = Object.keys(columnsData)
          .map(columnData => columnsData[columnData]?.links)
          .flat();

        verifyAboutVALinks(links);

        const headers = Object.keys(columnsData).map(
          columnData => columnsData[columnData]?.title,
        );

        for (const [index, header] of headers.entries()) {
          h.verifyHeaderWithoutSelector(index, header);
        }
      });
  };

  describe('desktop menu', () => {
    it('should correctly load all of the about va elements', () => {
      cy.injectAxeThenAxeCheck();

      const header = () => cy.get('.header');

      header()
        .scrollIntoView()
        .within(() => {
          verifyAboutVADesktopMenu();
        });
    });
  });

  describe('mobile menu', () => {
    it('should correctly load all of the about va elements', () => {
      cy.viewport(400, 1000);
      cy.injectAxeThenAxeCheck();

      h.clickMenuButton();

      const headerNav = () => cy.get('#header-nav-items');
      const aboutVAButton = () => cy.get('.header-menu-item-button').eq(1);

      headerNav().within(() => {
        aboutVAButton().click();

        const columnTitles = h
          .getColumnsDataForAboutVA()
          ?.map(column => column.title);

        const columnLinks = h
          .getColumnsDataForAboutVA()
          ?.map(column => column.links);
        for (const [index, title] of columnTitles.entries()) {
          const titleSelector = `[data-e2e-id="${title?.replaceAll(
            ' ',
            '-',
          )}"]`;
          h.verifyText(titleSelector, title);
          h.clickButton(titleSelector);

          const links = columnLinks[index];

          for (const link of links) {
            const testId = link.text
              ?.replaceAll(/[{(,&)}]/g, '')
              ?.replaceAll(' ', '-')
              .toLowerCase();
            h.verifyLink(`[data-e2e-id="${testId}"]`, link.text, link.href);
          }

          const backToMenuButton = () => cy.get('#header-back-to-menu');
          backToMenuButton().click();
        }
      });
    });
  });
});
