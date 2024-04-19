/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('./screenshots-current.day-of.cypress.spec');
    await import('./screenshots-current.pci.cypress.spec');
    await import('./screenshots-travel-claim.cypress.spec');
  }
})();
describe('Screenshots all', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
