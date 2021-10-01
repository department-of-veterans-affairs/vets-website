Cypress.Commands.add(
  'allyEvaluateRadioButtons',
  (selectorArray, arrowPressed, reversed = false) => {
    const element = selectorArray[0];

    cy.get(element).should('exist');
    if (reversed) {
      selectorArray
        .reverse()
        .forEach(sel => this.keys(arrowPressed).assert.isActiveElement(sel));
    } else {
      selectorArray.forEach(sel => {
        cy.get(sel)
          .should('be.focus')
          .realPress(arrowPressed);
      });
    }
  },
);
