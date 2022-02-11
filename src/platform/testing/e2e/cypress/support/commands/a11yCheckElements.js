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
          .should('be.focused')
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
    cy.keys(optionText.split(''));
    cy.get(selectMenu)
      .find(':selected')
      .should('contain', selectedOption);
  },
);

Cypress.Commands.add('allyEvaluateInput', (input, inputText) => {
  cy.get(input).should('exist');
  cy.get(input).should('be.focused');
  cy.get(input)
    .first()
    .type(inputText)
    .should('have.value', inputText);
});

Cypress.Commands.add('allyEvaluateCheckboxes', selectorArray => {
  const element = selectorArray[0];

  cy.get(element).should('exist');
  selectorArray.forEach((sel, i) => {
    cy.get(sel).should('be.focused');
    cy.realPress('Space');
    cy.get(sel).should('be.checked');
    if (i < selectorArray.length - 1) {
      cy.realPress('Tab');
    }
  });
});

Cypress.Commands.add(
  'allyEvaluateModalWindow',
  (modalTrigger, modalElement, modalCloseElement, triggerKey = 'Enter') => {
    cy.get(modalTrigger).should('exist');
    cy.realPress(triggerKey);
    cy.get(modalElement).should('be.visible');
    cy.get(modalCloseElement).should('be.focused');
    cy.realPress(triggerKey);
    cy.get(modalTrigger).should('be.focused');
  },
);

Cypress.Commands.add('hasFocusableCount', (selector, count) => {
  cy.get(selector).then(elem => {
    const allItems = elem[0].querySelectorAll(
      'a[href], button, details, input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="radio"], input[type="checkbox"], select, textarea, [tabindex="0"], [tabindex="-1"]',
    );
    const selectorArray = Array.from(allItems).filter(
      el => !el.hasAttribute('disabled'),
    );
    expect(selectorArray).to.have.lengthOf(count);
  });
});

Cypress.Commands.add('hasTabbableCount', (selector, count) => {
  cy.get(selector).then(elem => {
    const allItems = elem[0].querySelectorAll(
      'a[href], button, details, input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="radio"]:checked, input[type="checkbox"], select, textarea, [tabindex]:not([tabindex="-1"]',
    );
    const selectorArray = Array.from(allItems).filter(
      el => !el.hasAttribute('disabled'),
    );
    expect(selectorArray).to.have.lengthOf(count);
  });
});
