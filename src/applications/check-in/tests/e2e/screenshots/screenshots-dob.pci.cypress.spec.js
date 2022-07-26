(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/dob-validation/dob.validation.cypress.spec');
  }
})();
