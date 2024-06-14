/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../day-of/tests/e2e/errors/check-in-failed.cypress.spec');
    await import('../../../day-of/tests/e2e/errors/server.404.on.validate.cypress.spec');
    await import('../../../day-of/tests/e2e/errors/server.500.on.validate.cypress.spec');
    await import('../../../day-of/tests/e2e/errors/max.validation.failed.cypress.spec');
  }
})();
describe('Screenshots PCI', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
