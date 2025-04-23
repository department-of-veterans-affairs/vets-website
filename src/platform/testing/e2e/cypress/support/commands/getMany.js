/**
 * @callback getMany
 * @param {Array} selectors - an array of aliases/elements/etc to retrieve
 */
/**
 * This command will get multiple elements at once without individual callbacks
 * @param {String} name - Name of the new command
 * @param {getMany} callbackFunction - The callback that handles focusing & checking or unchecking a checkbox based on the checkbox state
 */
Cypress.Commands.add('getMany', selectors => {
  const values = Promise.all(
    selectors.map(name => cy.get(name).then($el => $el)),
  );
  return cy.wrap(values);
});
