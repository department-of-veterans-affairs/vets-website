import manifest from '../../manifest.json';

const avsId = '9A7AF40B2BC2471EA116891839113252';
const testUrl = `${manifest.rootUrl}/${avsId}`;

import avsData from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';

describe('After-visit Summary', () => {
  beforeEach(() => {
    cy.intercept('GET', `/avs/v0/avs/*`, avsData);
    cy.login();
  });

  it('is accessible', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');
    cy.injectAxeThenAxeCheck();
  });
});
