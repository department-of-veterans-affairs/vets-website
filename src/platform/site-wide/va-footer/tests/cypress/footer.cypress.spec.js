import features from '~/platform/utilities/tests/header-footer/mocks/features';
import * as h from '~/platform/utilities/tests/header-footer/utilities/helpers';
import * as mockHeaderFooterData from '~/platform/landing-pages/header-footer-data.json';
import { languageLinks } from '../../components/LanguageSupport';

const footerLinks = mockHeaderFooterData.footerData;

const bottomRailLinks = footerLinks.filter(
  link => link.column === 'bottom_rail',
);

describe('global footer', () => {
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

  describe('desktop footer', () => {
    it('should correctly load all of the footer elements', () => {
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      const footer = () => cy.get('.footer');

      footer()
        .scrollIntoView()
        .within(() => {
          h.verifyElement('[data-show="#modal-crisisline"]');

          const topRailLinks = footerLinks.filter(
            link => link.column !== 'bottom_rail',
          );

          for (const [index, link] of topRailLinks.entries()) {
            h.verifyLinkWithoutSelector(index, link.title, link.href);
          }

          // Language section
          h.verifyElement('.va-footer-links-bottom').eq(1);

          const languageSection = () => cy.get('.va-footer-links-bottom').eq(1);

          languageSection()
            .scrollIntoView()
            .within(() => {
              h.verifyText('.va-footer-linkgroup-title', 'Language assistance');

              for (const [index, link] of languageLinks.entries()) {
                h.verifyLinkWithoutSelector(index, link.label, link.href);
              }
            });

          // Logo section (footer)
          h.verifyElement('.footer-banner');

          // Bottom rail (footer)
          h.verifyElement('.va-footer-links-bottom').eq(1);

          const bottomRail = () => cy.get('.va-footer-links-bottom').eq(2);

          bottomRail()
            .scrollIntoView()
            .within(() => {
              for (const [index, link] of bottomRailLinks.entries()) {
                h.verifyLinkWithoutSelector(index, link.title, link.href);
              }
            });
        });
    });
  });

  describe('mobile footer', () => {
    it('should correctly load all of the footer elements', () => {
      cy.viewport('iphone-4');
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      const footerAccordion = () => cy.get('.va-footer-accordion');

      footerAccordion()
        .scrollIntoView()
        .within(() => {
          const crisisLineModal = () =>
            cy.get('va-crisis-line-modal[mode="trigger"]');
          h.verifyElement(crisisLineModal);

          const footerSections = [
            { title: 'Contact us', column: 4 },
            { title: 'Veteran programs and services', column: 1 },
            { title: 'More VA resources', column: 2 },
            { title: 'Get VA updates', column: 3 },
            { title: 'Language assistance' },
          ];

          for (const [index, section] of footerSections.entries()) {
            const button = () => cy.get('.va-footer-button').eq(index);

            cy.get('.va-footer-button')
              .eq(index)
              .should('exist')
              .should('be.visible')
              .contains(section.title);

            const accordionContent = () =>
              cy.get('.va-footer-accordion-content').eq(index);

            button().click();

            accordionContent()
              .scrollIntoView()
              .within(() => {
                if (section.title === 'Language assistance') {
                  for (const [languageIndex, link] of languageLinks.entries()) {
                    h.verifyLinkWithoutSelector(
                      languageIndex,
                      link.label,
                      link.href,
                    );
                  }
                }

                const links = footerLinks.filter(
                  link => link.column === section.column,
                );

                for (const [linkIndex, link] of links.entries()) {
                  h.verifyLinkWithoutSelector(linkIndex, link.title, link.href);
                }
              });
          }
        });

      h.verifyElement('[title="Go to VA.gov"]');

      const bottomRailContainer = () => cy.get('.va-footer-links-bottom').eq(1);

      bottomRailContainer()
        .scrollIntoView()
        .within(() => {
          for (const [index, link] of bottomRailLinks.entries()) {
            h.verifyLinkWithoutSelector(index, link.title, link.href);
          }
        });
    });
  });
});
