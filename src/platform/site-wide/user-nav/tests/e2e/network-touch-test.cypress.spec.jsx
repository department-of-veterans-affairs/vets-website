describe('network-touch smoke (XHR)', () => {
  describe('annotation smoke (forced)', () => {
    it('always produces a PR warning for this spec', () => {
      cy.visit('/'); // any page; not important
      // Force the annotation for THIS spec file
      cy.task('recordNetworkTouch', Cypress.spec.absolute, { log: false });
    });
  });
});
