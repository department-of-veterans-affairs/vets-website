/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../day-of/tests/e2e/happy-path/current.happy.path.cypress.spec');
    await import('../../../day-of/tests/e2e/extra-validation/validation.failed.cypress.spec');
    await import('../../../day-of/tests/e2e/appointment-details-display/appointment-details.display.cypress.spec');
    await import('../../../day-of/tests/e2e/appointment-details-display/appointment-details.complete.cypress.spec');
    await import('./screenshots-travel-pay.day-of.cypress.spec');
    await import('./screenshots-errors.day-of.cypress.spec');
  }
})();
describe('Screenshots day-of', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
