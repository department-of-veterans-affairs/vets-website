/* eslint-disable @department-of-veterans-affairs/axe-check-required */
(async () => {
  if (Cypress.env('with_screenshots')) {
    await import('../../../pre-check-in/tests/e2e/errors/pre-check-in-expired/error.expired.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/pre-check-in-past-15-min/error.past15min.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/get-pre-check-in/error.in.body.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/get-session/500.status.code.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/pre-check-in-for-canceled-appt/error.canceled.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/max.validation.failed.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/errors/post-pre-check-in/error.in.body.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/app-reload/reload.page.uuid.error.cypress.spec');
    await import('../../../pre-check-in/tests/e2e/app-reload/reload.page.error.cypress.spec');
  }
})();
describe('Screenshots PCI', () => {
  it('is true', () => {
    expect(true).to.equal(true);
  });
});
