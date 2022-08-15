(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/happy-path/happy.path.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/pre-check-in-expired/error.expired.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/get-pre-check-in/error.in.body.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/pre-check-in-for-canceled-appt/error.canceled.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/extra-validation/validation.failed.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/posting-answers/answered.no.to.three.questions.cypress.spec');
    await import('../../../day-of/tests/e2e/happy-path/current.happy.path.cypress.spec');
    await import('../../../day-of/tests/e2e/errors/check-in-failed.cypress.spec');
    await import('../../../day-of/tests/e2e/extra-validation/validation.failed.cypress.spec');
  }
})();
describe('Screenshots all', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
