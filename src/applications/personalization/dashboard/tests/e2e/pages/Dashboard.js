class DashboardPage {
  clickConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-contact-email')
      .findByRole('button', { name: /Confirm/i })
      .click();
  };

  clickErrorConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .findByRole('button', { name: /Confirm/i })
      .click();
  };

  clickErrorEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .find('va-link[href="/profile/contact-information#email-address"]')
      .shadow()
      .find('a')
      .click();
  };

  clickEditEmailLink = () => {
    cy.findByTestId('mhv-alert--confirm-contact-email')
      .find('va-link[href="/profile/contact-information#email-address"]')
      .shadow()
      .find('a')
      .click();
  };
}

export default new DashboardPage();
