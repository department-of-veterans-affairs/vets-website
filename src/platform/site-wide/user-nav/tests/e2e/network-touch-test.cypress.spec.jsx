describe('annotator debug', () => {
  it('confirms hook + flips touched', () => {
    cy.task('annotatorCanary', 'spec booted');
    cy.visit('/');

    // (A) support hook present??
    cy.window().then(win => {
      expect(Boolean(win.__annotator__ && win.__annotator__.wrapped)).to.eq(
        true,
      );
    });

    // (B) cause a real XHR (should flip 'touched' via XHR.prototype.open)
    cy.window().then(win => {
      const xhr = new win.XMLHttpRequest();
      xhr.open('GET', 'https://httpbin.org/status/204');
      try {
        xhr.send();
        // eslint-disable-next-line no-empty
      } catch (_) {}
    });

    // (C) verify the flag flipped
    cy.window().then(win => {
      expect(win.__annotator__.getTouched(), 'touched flipped').to.eq(true);
    });
  });
});
