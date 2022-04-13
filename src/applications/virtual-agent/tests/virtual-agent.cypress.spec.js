import manifest from '../manifest.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.

  it('check if user is able to see the chat bot', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();

    const startChatButton = '[data-testid="btnAcceptDisclaimer"]';
    const welcomeBubble = '.webchat__bubble--show-nub p';
    const expectedWelcomeText = 'Welcome to the VA virtual agent.';
    const textField = '.webchat__send-box-text-box__input';
    const actualResponse =
      'You may be eligible for education benefits under this program if you meet these requirements.';

    cy.get(startChatButton, { timeout: 60000 });
    cy.get(startChatButton).should('be.visible');

    cy.get(startChatButton).click();
    cy.get(welcomeBubble, { timeout: 60000 });
    cy.get(welcomeBubble)
      .invoke('text')
      .should('eq', expectedWelcomeText);

    cy.get(textField)
      .type('MGIB')
      .type('{enter}');
    cy.contains('span', 'Yes', { timeout: 60000 });
    cy.contains('p', 'You may be eligible for education')
      .invoke('text')
      .should('include', actualResponse);

    // When user selects Yes
    cy.contains('span', 'Yes').click();
    cy.get('[alt="4"]', { timeout: 60000 }).click();
    cy.contains('span', 'No, thanks').click();

    // When user selects No
    cy.get(textField)
      .type('Covid Vaccine')
      .type('{enter}');
    cy.contains('span', 'No', { timeout: 60000 }).click();
    cy.contains('span', 'Speak with an agent', { timeout: 60000 }).should(
      'be.visible',
    );
    cy.contains('span', 'Try again').click();
  });
});
