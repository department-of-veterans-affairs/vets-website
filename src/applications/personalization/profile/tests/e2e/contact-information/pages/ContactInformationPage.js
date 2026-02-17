class ContactInformationPage {
  clickAddEmailAddress = () => {
    cy.findByTestId('profile-alert--add-contact-email')
      .find('va-button-pair')
      .shadow()
      .find('va-button')
      .first()
      .shadow()
      .find('button')
      .click();
  };

  clickSkipAddingEmailAddress = () => {
    cy.findByTestId('profile-alert--add-contact-email')
      .find('va-button-pair')
      .shadow()
      .within(() => {
        cy.get('va-button[secondary]')
          .shadow()
          .find('button')
          .click();
      });
  };

  clickConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-email-button').click();
  };

  clickEditEmail = () => {
    cy.findByTestId('profile-alert--confirm-contact-email')
      .find('va-button[text="Edit contact email"]')
      .shadow()
      .find('button')
      .click();
  };

  clickErrorConfirmEmail = () => {
    cy.findByTestId('mhv-alert--confirm-email-button').click();
  };

  clickErrorEditEmail = () => {
    cy.findByTestId('mhv-alert--confirm-error')
      .find('va-button[text="Edit contact email"]')
      .shadow()
      .find('button')
      .click();
  };
}

export default new ContactInformationPage();
