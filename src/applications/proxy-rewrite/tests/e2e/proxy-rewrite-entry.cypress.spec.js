/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import manifest from '../../manifest.json';
import { proxyRewriteWhitelist as allowList } from '../../proxy-rewrite-whitelist.json';

describe(manifest.appName, () => {
  // Skip tests unless we are running the daily workflow job
  // eslint-disable-next-line func-names
  before(function() {
    if (Cypress.env('RUN_INJECTION') !== true) this.skip();
  });

  it('Should not inject header & footer on non-allowed host', () => {
    const hostToEval = 'www.innovation.va.gov';
    const isAllowed = allowList.some(item => item.hostname === hostToEval);

    if (!isAllowed) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.ts-header-container > header').should('not.exist');
      cy.get('.ts-header-container > footer').should('not.exist');
    } else {
      throw new Error('Evaluated hostname is allowed.');
    }
  });

  it('Should not inject header & footer on allowed hosts that are cookie-only', () => {
    const hostToEval = 'www.volunteer.va.gov';
    const listItem = allowList.find(item => item.hostname === hostToEval);
    const { cookieOnly } = listItem;

    if (cookieOnly) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.ts-header-container > header').should('not.exist');
      cy.get('.ts-header-container > footer').should('not.exist');
    } else {
      throw new Error(
        'Evaluated hostname is not allowed or is not cookie-only.',
      );
    }
  });

  it('Should inject header & footer on allowed hosts that are not cookie-only', () => {
    const hostToEval = 'www.ea.oit.va.gov';
    const listItem = allowList.find(item => item.hostname === hostToEval);
    const { cookieOnly } = listItem;

    if (!cookieOnly) {
      cy.visit(`https://${hostToEval}`);
      cy.get('.ts-header-container > header').should('exist');
      cy.get('.ts-header-container > footer').should('exist');
    } else {
      throw new Error('Evaluated hostname is not allowed or is cookie-only.');
    }
  });
});
