/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../day-of/tests/e2e/travel-path/travel.pay.path.cypress.spec');
    await import('../../../day-of/tests/e2e/travel-path/travel.pay.unhappy.path.cypress.spec');
    await import('../../../day-of/tests/e2e/travel-path/travel.pay.errors.cypress.spec');
  }
})();
describe('Screenshots day-of travel pay', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
