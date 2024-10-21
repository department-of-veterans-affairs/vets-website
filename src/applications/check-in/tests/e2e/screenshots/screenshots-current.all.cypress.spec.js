/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('./screenshots-day-of-check-in.cypress.spec');
    await import('./screenshots-pre-check-in.cypress.spec');
    await import('./screenshots-travel-claim.cypress.spec');
  }
})();
describe('Screenshots all check-in applications', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
