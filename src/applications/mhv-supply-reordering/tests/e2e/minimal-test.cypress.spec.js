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
      name: /^Medical supplies$/,
    };
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should.exist;
    cy.findByRole('heading', heading).should('have.focus');
    cy.findByText(/^Start a new order$/).click();

    // choose supplies
    cy.injectAxeThenAxeCheck();
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should('not.exist');
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.findByText(/^Continue$/).click();

    // contact information
    cy.injectAxeThenAxeCheck();
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should('not.exist');
    cy.findByText(/^Continue$/).click();

    // review
    cy.injectAxeThenAxeCheck();
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should('not.exist');
    cy.findByText(/^Submit$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should.exist;
    cy.get('va-alert[status="success"] h2').should(
      'contain.text',
      'You’ve submitted your medical supplies order',
    );
    cy.findByRole('link', { name: /^Go back to VA.gov$/ });
  });
});
