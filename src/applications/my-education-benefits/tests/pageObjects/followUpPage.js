class followUpPage {
  getListOfAllContactMethodRadioButtons() {
    return cy.get('input[id*="root_contactMethod"]');
  }

  getEmailContactMethodRadioButton() {
    return cy.get('input[id*="root_contactMethod"][ value="Email"]');
  }

  getMailContactMethodRadioButton() {
    return cy.get('input[id*="root_contactMethod" ][ value="Mail"]');
  }

  getHomePhoneContactMethodRadioButton() {
    return cy.get('input[id*="root_contactMethod" ][  value="Home Phone"]');
  }

  getMobilePhoneContactMethodRadioButton() {
    return cy.get('input[id*="root_contactMethod" ][ value="Mobile Phone"]');
  }

  getListOfNotificationRadioButtons() {
    return cy.get(
      'input[id*="root_view:receiveTextMessages_receiveTextMessages"]',
    );
  }

  getYesSendMeTextMessageButton() {
    return cy.get(
      'input[id*="root_view:receiveTextMessages_receiveTextMessages_0"][ value="Yes, send me text message notifications"]',
    );
  }

  getNoJustSendMeEmailButton() {
    return cy.get(
      'input[id*="root_view:receiveTextMessages_receiveTextMessages"][ value="No, just send me email notifications"]',
    );
  }
}

export default followUpPage;
