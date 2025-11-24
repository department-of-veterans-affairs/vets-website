class DashboardPage {
  clickConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-contact-email')
      .find('va-button[text="Confirm"]')
      .shadow()
      .find('button')
      .click();
  };

  clickErrorConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .find('va-button[text="Confirm"]')
      .shadow()
      .find('button')
      .click();
  };

  clickErrorEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .find(
        'va-link[href="/profile/contact-information#contact-email-address"]',
      )
      .shadow()
      .find('a')
      .click();
  };

  clickEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-contact-email')
      .find(
        'va-link[href="/profile/contact-information#contact-email-address"]',
      )
      .shadow()
      .find('a')
      .click();
  };
}

export default new DashboardPage();
