import { appName, rootUrl } from '../../manifest.json';
import { initializeApi, userMock } from './setup';

let heading;

describe(`${appName} -- minimal test`, () => {
  before(() => initializeApi());
  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
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
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
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
      name: /^You’ve submitted your medical supplies order$/,
    };
    cy.findByRole('heading', heading);
    cy.findByRole('link', { name: /^Go back to VA.gov$/ });
  });
});
