(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../day-of/tests/e2e/dob-validation/dob.validation.cypress.spec');
  }
})();
describe('Screenshots day-of dob', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
