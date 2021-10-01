Cypress.Commands.add(
  'allyEvaluateRadioButtons',
  (selectorArray, arrowPressed, reversed = false) => {
    const element = selectorArray[0];

    cy.get(element).should('exist');
    if (reversed) {
      selectorArray.reverse().forEach(sel => {
        cy.realPress(arrowPressed);
        cy.get(sel).should('be.focused');
      });
    } else {
      selectorArray.forEach(sel => {
        cy.get(sel)
          .should('be.focus')
          .realPress(arrowPressed);
      });
    }
  },
);

Cypress.Commands.add(
  'allyEvaluateSelectMenu',
  (selectMenu, optionText, selectedOption) => {
    cy.get(selectMenu).should('be.visible');
    cy.get(selectMenu).should('be.focused');
    cy.keys(['d', 'r']);
    cy.get(selectMenu).should('have.value', selectedOption);
  },
);
