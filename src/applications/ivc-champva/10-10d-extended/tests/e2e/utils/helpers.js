export const goToNextPage = pagePath => {
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const startAsGuestUser = () => {
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.location('pathname').should(
    'include',
    '/your-information/who-is-applying',
  );
};

// helpers for creating state machines to handle ArrayBuilder actions
export const countArrayItems = (selectors = ['va-card']) => {
  return cy.get('body').then($body => {
    for (const sel of selectors) {
      const n = $body.find(sel).length;
      if (n > 0) return n;
    }
    return 0;
  });
};

export const createSummaryHandler = fieldName => {
  return () => {
    countArrayItems().then(count => {
      const shouldAdd = count === 0;
      cy.log(
        `Summary detected ${count} existing item(s); selecting ${
          shouldAdd ? 'Yes (Add)' : 'No (Finish)'
        }`,
      );
      cy.selectYesNoVaRadioOption(fieldName, shouldAdd);
      cy.injectAxeThenAxeCheck();
      goToNextPage();
    });
  };
};
