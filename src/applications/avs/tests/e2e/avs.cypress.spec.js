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

  it('only the top accordion is open by default', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');
    cy.get("[header='Your appointment on January 1, 2023'][open='true']")
      .shadow()
      .get('.avs-accordion-item')
      .contains('You were diagnosed with')
      .should('be.visible');
    cy.get("[header='Your treatment plan from this appointment']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.get("[header='Your health information as of this appointment']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.get("[header='More information']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('lower accordions can be expanded', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');

    cy.contains('Consultations').should('not.be.visible');
    cy.get("[header='Your treatment plan from this appointment']").click();
    cy.contains('Consultations').should('be.visible');

    cy.contains('Primary care team').should('not.be.visible');
    cy.get("[header='Your health information as of this appointment']").click();
    cy.contains('Primary care team').should('be.visible');

    cy.contains('More help and information').should('not.be.visible');
    cy.get("[header='More information']").click();
    cy.contains('More help and information').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });
});
