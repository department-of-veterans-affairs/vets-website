Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
