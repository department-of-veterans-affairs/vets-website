/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../travel-claim/tests/e2e/errors-already-filed.cypress.spec');
    await import('../../../travel-claim/tests/e2e/errors-form-validation.cypress.spec');
    await import('../../../travel-claim/tests/e2e/errors-retrieving-data.cypress.spec');
    await import('../../../travel-claim/tests/e2e/errors-submitting-travel-claim.cypress.spec');
    await import('../../../travel-claim/tests/e2e/errors-uuid.cypress.spec');
    await import('../../../travel-claim/tests/e2e/errors-validation.cypress.spec');
    await import('../../../travel-claim/tests/e2e/multiple-appointment.cypress.spec');
    await import('../../../travel-claim/tests/e2e/single-appointment.cypress.spec');
  }
})();
describe('Screenshots Travel-claim application', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
