(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('./screenshots-current.day-of.cypress.spec');
    await import('./screenshots-current.pci.cypress.spec');
  }
})();
describe('Screenshots all', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
