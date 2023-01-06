import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    cy.get('[data-testid=feature-flag-true] button:nth-child(1)')
      .last()
      .click();
    cy.get('[data-testid=radio-print-one-message]')
      .shadow()
      .find('label')
      .should('have.text', 'Only print this message')
      .should('be.visible');
    cy.get('[data-testid=print-modal-popup] p')
      .should(
        'have.text',
        'Would you like to print this one message, or all messages in this conversation?',
      )
      .should('be.visible');
    cy.get('[data-testid=radio-print-one-message]').click();
    cy.get('[data-testid=print-modal-popup]')
      .shadow()
      .find('[type=button]')
      .contains('Print')
      .click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
