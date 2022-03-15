import manifest from '../../manifest.json';
import { proxyRewriteWhitelist as whitelist } from '../../proxy-rewrite-whitelist.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('Should not inject header & footer on non-whitelisted host', () => {
    const hostToEval = 'www.innovation.va.gov';
    const isWhitelisted = whitelist.some(item => item.hostname === hostToEval);

    if (!isWhitelisted) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.consolidated > header').should('not.exist');
      cy.get('.consolidated > footer').should('not.exist');
    } else {
      throw new Error('Evaluated hostname is whitelisted.');
    }
  });

  it('Should not inject header & footer on whitelisted hosts that are cookie-only', () => {
    const hostToEval = 'www.volunteer.va.gov';
    const listItem = whitelist.find(item => item.hostname === hostToEval);
    const { cookieOnly } = listItem;

    if (cookieOnly) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.consolidated > header').should('not.exist');
      cy.get('.consolidated > footer').should('not.exist');
    } else {
      throw new Error(
        'Evaluated hostname is not whitelisted or is not cookie-only.',
      );
    }
  });

  it('Should inject header & footer on whitelisted hosts that are not cookie-only', () => {
    const hostToEval = 'www.benefits.va.gov';
    const listItem = whitelist.find(item => item.hostname === hostToEval);
    const { cookieOnly } = listItem;

    if (!cookieOnly) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.consolidated > header').should('exist');
      cy.get('.consolidated > footer').should('exist');
    } else {
      throw new Error(
        'Evaluated hostname is not whitelisted or is cookie-only.',
      );
    }
  });
});
