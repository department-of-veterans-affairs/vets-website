/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/happy-path/happy.path.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/extra-validation/validation.failed.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/posting-answers/answered.no.to.three.questions.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/appointment-details-display/appointment-details.display.cypress.spec');
    await import('./screenshots-phone.pci.cypress.spec');
    await import('./screenshots-errors.pci.cypress.spec');
  }
})();
describe('Screenshots PCI', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
