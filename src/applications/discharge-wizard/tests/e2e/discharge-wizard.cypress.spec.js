function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
}

describe('functionality of discharge wizard', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('fill out the form and expect the form to have elements', () => {
    // navigate to discharge wizard and make an axe check
    // landing page
    cy.visit('/discharge-upgrade-instructions/');
    axeTestPage();

    // questions page | fill out form
    cy.get('.main .usa-button-primary').click();

    cy.get('input[name="1_branchOfService"]')
      .first()
      .click();

    cy.get('select[name="2_dischargeYear"]').select('2016');
    cy.get('input[name="4_reason"]')
      .first()
      .click();

    cy.get('input[name="6_intention"]')
      .first()
      .click();

    cy.get('input[name="7_courtMartial"]')
      .first()
      .click();

    cy.get('input[name="8_prevApplication"]')
      .first()
      .click();

    cy.get('input[name="9_prevApplicationYear"]')
      .first()
      .click();

    cy.get('input[name="12_priorService"]')
      .first()
      .click();

    // a11y check after all elements are visible
    axeTestPage();

    cy.get('.main .usa-button-primary').click();

    // a11y check on results page
    axeTestPage();

    // open Form download
    cy.get('.main .usa-button-primary').click();
  });
});
