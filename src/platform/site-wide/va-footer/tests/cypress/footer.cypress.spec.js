import features from '../../../../utilities/tests/header-footer/mocks/features';
import * as footerLinks from './footer-links';
import * as staticFooterData from '~/platform/landing-pages/header-footer-data.json';

// IMPORTANT: These tests verify the accuracy of the VA.gov footer against production (as of the time of writing this test)
// and against header-footer-data.json, which is used to populate the footer in local dev when content-build is not running.
// It is important that both of these stay in parity with what is in production.
const staticFooterLinks = staticFooterData.footerData;

describe('global footer', () => {
  const verifyElement = selector =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible');

  const verifyText = (selector, text) =>
    cy
      .get(selector)
      .should('exist')
      .should('be.visible')
      .contains(text);

  const verifyLink = (index, linkText, href) =>
    cy
      .get('a')
      .eq(index)
      .should('be.visible')
      .should('contain.text', linkText)
      .should('have.attr', 'href')
      .and('include', href);

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

  it('should correctly load all of the footer elements', () => {
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    verifyElement('.footer');

    const footer = () => cy.get('.footer');

    footer()
      .scrollIntoView()
      .within(() => {
        verifyElement('[data-show="#modal-crisisline"]');

        for (const [index, link] of footerLinks.topRail.entries()) {
          const matchingLink = staticFooterLinks.filter(
            footerLink => footerLink.title === link.text,
          );

          if (!matchingLink.length) {
            throw new Error(
              `Update the header-footer-data.json file; this link was not found: ${
                link.text
              }`,
            );
          }

          verifyLink(index, link.text, link.href);
        }

        // Language section
        verifyElement('.va-footer-links-bottom').eq(1);

        const languageSection = () => cy.get('.va-footer-links-bottom').eq(1);

        languageSection()
          .scrollIntoView()
          .within(() => {
            verifyText('.va-footer-linkgroup-title', 'Language assistance');

            for (const [index, link] of footerLinks.language.entries()) {
              verifyLink(index, link.text, link.href);
            }
          });

        // Logo section (footer)
        verifyElement('.footer-banner');

        // Bottom rail (footer)
        verifyElement('.va-footer-links-bottom').eq(1);

        const bottomRail = () => cy.get('.va-footer-links-bottom').eq(2);

        bottomRail()
          .scrollIntoView()
          .within(() => {
            for (const [index, link] of footerLinks.bottomRail.entries()) {
              const matchingLink = staticFooterLinks.filter(
                footerLink => footerLink.title === link.text,
              );

              if (!matchingLink.length) {
                throw new Error(
                  `Make sure header-footer-data.json and footer-links.js match; this link was not found: ${
                    link.text
                  }`,
                );
              }

              verifyLink(index, link.text, link.href);
            }
          });
      });
  });
});
