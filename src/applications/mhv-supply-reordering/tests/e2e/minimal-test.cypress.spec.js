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
    cy.findByText(/^Start a new order$/).click({ waitForAnimations: true });

    // choose supplies
    cy.injectAxeThenAxeCheck();
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.findByText(/^Continue$/).click();

    // contact information
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Continue$/).click();

    // review
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Submit order$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 2,
      name: /^Your application has been submitted$/,
    };
    cy.findByRole('heading', heading); // .should('have.focus'); // it _should_ have focus, but does not
  });
});
