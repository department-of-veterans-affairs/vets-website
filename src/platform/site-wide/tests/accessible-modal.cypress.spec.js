describe('Accessible Modal Test', () => {
  let overlay;
  let firstModalItem;
  let closeControl;
  let firstOpenControl;
  let thirdOpenControl;
  let lastModalItem;
  beforeEach(() => {
    overlay = () =>
      cy
        .get('va-crisis-line-modal')
        .first()
        .shadow()
        .find('va-modal');
    firstModalItem = () =>
      cy
        .get('va-crisis-line-modal')
        .first()
        .shadow()
        .find('a[href="tel:988"]');
    closeControl = () =>
      cy
        .get('va-crisis-line-modal')
        .first()
        .shadow()
        .find('button.va-modal-close');
    firstOpenControl = () =>
      cy
        .get('va-crisis-line-modal')
        .first()
        .shadow()
        .find('button.va-crisis-line.va-overlay-trigger');
    thirdOpenControl = () =>
      cy.get('footer .va-button-link.va-overlay-trigger');
    lastModalItem = () =>
      cy
        .get('va-crisis-line-modal')
        .first()
        .shadow()
        .find('a[href="https://www.veteranscrisisline.net/"]');
  });
  it('Modal behaves appropriately in line with key presses', () => {
    cy.visit('/');

    // Open modal with keyboard
    firstOpenControl()
      .should('be.visible')
      .scrollIntoView()
      .focus()
      .realPress('Enter');
    // Wait for modal to open
    overlay().should('be.visible');
    cy.injectAxeThenAxeCheck();

    closeControl()
      .should('be.focused')
      .repeatKey(['Shift', 'Tab'], 1);

    lastModalItem().should('be.focused');

    // Trap forward traversal
    cy.realPress('Tab');
    cy.realPress('Tab');

    firstModalItem().should('be.focused');

    // Escape modal
    cy.realPress('Escape');
    overlay().should('not.be.visible');

    // Return focus to appropriate open controls
    firstOpenControl().should('be.focused');

    thirdOpenControl()
      .focus()
      .realPress('Enter');
    closeControl().should('be.focused');

    cy.realPress('Escape');
    thirdOpenControl().should('be.focused');
  });
});
