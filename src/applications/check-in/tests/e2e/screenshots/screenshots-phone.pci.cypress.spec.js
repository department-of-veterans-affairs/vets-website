/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/phone-appointments/phone.appointment.path.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/phone-appointments/phone.appointment.canceled.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/phone-appointments/phone.appointment.expired.cypress.spec');
  }
})();
describe('Screenshots PCI phone appointments', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
