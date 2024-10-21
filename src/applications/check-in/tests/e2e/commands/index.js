/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable  cypress/no-assigning-return-values */

import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

const { defaultUUID } = sharedData.get;

Cypress.Commands.add('visitWithUUID', (uuid = defaultUUID, language = 'en') => {
  cy.visit(`/health-care/appointment-check-in/?id=${uuid}`, {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language', {
        value: `${language}-US`,
      });
      Object.defineProperty(win.navigator, 'languages', { value: [language] });
      Object.defineProperty(win.navigator, 'accept_languages', {
        value: [language],
      });
    },
    headers: {
      'Accept-Language': language,
    },
  });
});

Cypress.Commands.add('visitPreCheckInWithUUID', (uuid = defaultUUID) => {
  cy.visit(`/health-care/appointment-pre-check-in/?id=${uuid}`);
});

Cypress.Commands.add('visitTravelClaimWithUUID', (uuid = defaultUUID) => {
  cy.visit(`/my-health/appointment-travel-claim/?id=${uuid}`);
});

Cypress.Commands.add('createScreenshots', filename => {
  if (Cypress.env('with_screenshots')) {
    cy.viewportPreset('va-top-mobile-2');
    // Wait for viewport to resize.
    cy.wait(1000);
    // Disable smooth scrolling
    cy.get('html, body').invoke(
      'attr',
      'style',
      'height: auto; scroll-behavior: auto;',
    );
    // Hide local only BackToHome link
    cy.get('.local-start-again').invoke('attr', 'style', 'display: none;');
    // Create screenshot
    cy.screenshot(`english/${filename}`);
    // Wait while screenshot is created
    cy.wait(1000);
    // Capture Spanish
    cy.get('[data-testid="translate-button-es"]').click();
    cy.wait(1000);
    cy.screenshot(`spanish/${filename}-spanish`);
    cy.wait(1000);
    // Capture Tagalog
    cy.get('[data-testid="translate-button-tl"]').click();
    cy.wait(1000);
    cy.screenshot(`tagalog/${filename}-tagalog`);
    cy.wait(1000);
    // Back to english
    cy.get('[data-testid="translate-button-en"]').click();
    const expandHiddenItem = item => {
      item.each((i, v) => {
        cy.get(v)
          .shadow()
          .find('[aria-expanded="false"]')
          .click();
      });
      cy.wait(1000);
    };
    // Expand additional info if it exists and make more screenshots
    const alert = cy.$$('va-alert-expandable');
    const additionalInfo = cy.$$('va-additional-info');
    const accordion = cy.$$('va-accordion-item');
    let hiddenItems = false;
    if (alert.length) {
      expandHiddenItem(alert);
      hiddenItems = true;
    }
    if (additionalInfo.length) {
      expandHiddenItem(additionalInfo);
      hiddenItems = true;
    }
    if (accordion.length) {
      expandHiddenItem(accordion);
      hiddenItems = true;
    }
    if (hiddenItems) {
      cy.screenshot(`english/${filename}-items-expanded`);
      cy.wait(1000);
      // Capture Spanish
      cy.get('[data-testid="translate-button-es"]').click();
      cy.wait(1000);
      cy.screenshot(`spanish/${filename}-items-expanded-spanish`);
      cy.wait(1000);
      // Capture Tagalog
      cy.get('[data-testid="translate-button-tl"]').click();
      cy.wait(1000);
      cy.screenshot(`tagalog/${filename}-items-expanded-tagalog`);
      cy.wait(1000);
      // Back to english
      cy.get('[data-testid="translate-button-en"]').click();
    }
  }
});
