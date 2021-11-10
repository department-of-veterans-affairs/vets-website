const axeTestPage = () => {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
};

describe('Header', () => {
  it('it works as expected', () => {
    // Navigate to the homepage and axe check it.
    cy.visit('/');

    // A11y check the search results.
    axeTestPage();
  });
});
