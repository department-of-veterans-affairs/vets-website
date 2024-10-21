/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/authentication.failure.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/demographics.needs.to.confirm.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors.api.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors.appointment.cypress.spec');
  }
})();
describe('Screenshots Pre-check-in application', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
