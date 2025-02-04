import { appName, rootUrl } from '../../manifest.json';
import { initializeApi, userMock } from './setup';

let heading;

describe(`${appName} -- form submit failure`, () => {
  before(() => initializeApi());
  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('handles a 500 response', () => {
    cy.intercept('POST', '/v0/mdot/supplies', { statusCode: 500 });
    // introduction
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.findByText(/^Continue$/).click();

    // contact information
    cy.findByText(/^Continue$/).click();

    // review
    cy.findByText(/^Submit order$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 2,
      name: /^Your application has been submitted$/,
    };
    cy.findByRole('heading', heading);
  });

  it('handles a 422 response', () => {
    cy.intercept('POST', '/v0/mdot/supplies', { statusCode: 422 });
    // introduction
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.findByText(/^Continue$/).click();

    // contact information
    cy.findByText(/^Continue$/).click();

    // review
    cy.findByText(/^Submit order$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 2,
      name: /^Your application has been submitted$/,
    };
    cy.findByRole('heading', heading);
  });
});
