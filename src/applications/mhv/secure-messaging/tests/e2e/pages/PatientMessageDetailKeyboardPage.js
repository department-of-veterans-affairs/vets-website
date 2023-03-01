class PatientMessageDetailKeyboardPage {
  navigatePrintButton = () => {
    cy.tabToElement(':nth-child(1) > .usa-button-secondary');
    cy.realPress(['Enter']);
    cy.get('[data-testid="print-modal-popup"]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realPress(['Enter']);
  };

  navigateTrashButton = () => {
    cy.tabToElement(':nth-child(2) > .usa-button-secondary');
    cy.realPress(['Enter']);
    cy.get('[data-testid="delete-message-modal"]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realPress(['Enter']);
  };

  navigateMoveToButton = () => {
    cy.tabToElement(':nth-child(3) > .usa-button-secondary');
    cy.realPress(['Enter']);
    cy.get('[data-testid=move-to-modal]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realPress(['Enter']);
  };
}
export default PatientMessageDetailKeyboardPage;
