/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../day-of/tests/e2e/authentication.failure.cypress.spec');
    await import('../../../day-of/tests/e2e/complete.check.in.go.back.cypress.spec');
    await import('../../../day-of/tests/e2e/demographics.needs.to.confirm.cypress.spec');
    await import('../../../day-of/tests/e2e/errors.api.connection.cypress.spec');
    await import('../../../day-of/tests/e2e/errors.appointment.cypress.spec');
    await import('../../../day-of/tests/e2e/travel.claim.cypress.spec');
  }
})();
describe('Screenshots Day-of-check-in application', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
