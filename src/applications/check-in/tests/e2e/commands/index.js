/* eslint-disable cypress/no-unnecessary-waiting */
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
    const screenshotHiddenItem = (item, type) => {
      item.each((i, v) => {
        cy.get(v)
          .shadow()
          .find('[aria-expanded="false"]')
          .click();
      });
      cy.screenshot(`english/${filename}-${type}-expanded`);
      cy.wait(1000);
      // Capture Spanish
      cy.get('[data-testid="translate-button-es"]').click();
      cy.wait(1000);
      cy.screenshot(`spanish/${filename}-${type}-expanded-spanish`);
      cy.wait(1000);
      // Capture Tagalog
      cy.get('[data-testid="translate-button-tl"]').click();
      cy.wait(1000);
      cy.screenshot(`tagalog/${filename}-${type}-expanded-tagalog`);
      cy.wait(1000);
      // Back to english
      cy.get('[data-testid="translate-button-en"]').click();
    };
    // Expand additional info if it exists and make more screenshots
    // eslint-disable-next-line cypress/no-assigning-return-values
    const additionalInfo = cy.$$('va-additional-info');
    // eslint-disable-next-line cypress/no-assigning-return-values
    const accordion = cy.$$('va-accordion-item');
    if (additionalInfo.length) {
      screenshotHiddenItem(additionalInfo, 'info');
    }
    if (accordion.length) {
      screenshotHiddenItem(accordion, 'accordion');
    }
  }
});
