describe('network-touch smoke (XHR)', () => {
  describe('annotation smoke (forced)', () => {
    it('always produces a PR warning for this spec', () => {
      cy.task('recordNetworkTouch', Cypress.spec.absolute, { log: false });
      // Emit the annotation immediately so GitHub captures it even if after:spec misses
      cy.task('emitAnnotationNow', Cypress.spec.absolute, { log: false });
    });
  });
});
