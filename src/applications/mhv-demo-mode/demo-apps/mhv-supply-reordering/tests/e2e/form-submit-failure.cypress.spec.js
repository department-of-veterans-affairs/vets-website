import { appName, rootUrl } from '../../manifest.json';
import { initializeApi, userMock } from './setup';

describe(`${appName} -- form submit failure`, () => {
  beforeEach(() => {
    initializeApi();
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('handles a 422 response', () => {
    cy.intercept('POST', '/v0/mdot/supplies', { statusCode: 422 });
    // introduction
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.clickContinue();

    // contact information
    cy.clickContinue();

    // review
    cy.findByText(/^Submit$/).click();
    cy.findByText(/We’re sorry/);
    cy.injectAxeThenAxeCheck();
  });

  it('handles a 500 response', () => {
    cy.intercept('POST', '/v0/mdot/supplies', { statusCode: 500 });
    // introduction
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.clickContinue();

    // contact information
    cy.clickContinue();

    // review
    cy.findByText(/^Submit$/).click();
    cy.findByText(/We’re sorry/);
    cy.injectAxeThenAxeCheck();
  });
});
