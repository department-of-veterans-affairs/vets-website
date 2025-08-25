describe('network-touch smoke (XHR)', () => {
  describe('annotation smoke (forced)', () => {
    it('always produces a PR warning for this spec', () => {
      cy.task('recordNetworkTouch', Cypress.spec.absolute, { log: false });
    });
  });
});
