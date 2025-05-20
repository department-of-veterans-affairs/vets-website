const overlay = '#modal-crisisline';
const firstModalItem = 'a[href="tel:988"]';
const closeControl = '.va-crisis-panel.va-modal-inner button';
const firstOpenControl = '[data-show="#modal-crisisline"]';
const thirdOpenControl = 'footer .va-button-link.va-overlay-trigger';
const lastModalItem = 'a[href="https://www.veteranscrisisline.net/"]';

describe('Accessible Modal Test', () => {
  it('Modal behaves appropriately in line with key presses', () => {
    cy.visit('/');

    // Open modal
    cy.get(firstOpenControl)
      .first()
      .focus()
      .realPress('Enter');
    cy.injectAxeThenAxeCheck();

    // Trap backward traversal
    cy.get(firstModalItem)
      .should('be.focused')
      .repeatKey(['Shift', 'Tab'], 2);
    cy.get(lastModalItem).should('be.focused');

    // Trap forward traversal
    cy.realPress('Tab');
    cy.get(closeControl).should('be.focused');

    // Escape modal
    cy.realPress('Escape');
    cy.get(overlay).should('not.have.class', 'va-overlay--open');
    cy.get('body').should('not.have.class', 'va-pos-fixed');

    // Return focus to appropriate open controls
    cy.get(firstOpenControl)
      .first()
      .should('be.focused');

    cy.get(thirdOpenControl)
      .first()
      .focus()
      .realPress('Enter');
    cy.get(firstModalItem).should('be.focused');

    cy.realPress('Escape');
    cy.get(thirdOpenControl).should('be.focused');
  });
});
