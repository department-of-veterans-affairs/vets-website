import { appName, rootUrl } from '../../manifest.json';
import { initializeApi, user } from './utils';

let heading;

describe(`${appName} -- minimal test`, () => {
  before(() => initializeApi());
  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(user);
    cy.visit(rootUrl);
  });

  it('is successful', () => {
    // introduction
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /^Order medical supplies$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.injectAxeThenAxeCheck();
    cy.findByRole('checkbox', { name: 'root_chosenSupplies_6584' }).check();
    cy.findByText(/^Continue$/).click();

    // contact information
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Continue$/).click();

    // review
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Submit$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 2,
      name: /^Your applicationl has been submitted$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
  });
});
