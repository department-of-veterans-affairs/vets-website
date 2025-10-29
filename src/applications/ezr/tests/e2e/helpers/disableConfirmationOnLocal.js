export const disableConfirmationOnLocal = () => {
  cy.on('window:before:load', win => {
    Object.defineProperty(win, 'onbeforeunload', {
      configurable: true,
      writable: true,
      value: null,
    });

    const orig = win.addEventListener;
    cy.stub(win, 'addEventListener').callsFake(
      (e, h, o) => (e === 'beforeunload' ? undefined : orig.call(win, e, h, o)),
    );
  });
};
