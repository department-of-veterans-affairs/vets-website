import manifest from '../manifest.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.

  it('is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
  });

  it('check if user is able to see the chat bot', () => {
    const startChatButton = '[data-testid="btnAcceptDisclaimer"]';
    const welcomeBubble = '.webchat__bubble--show-nub p';
    const expectedWelcomeText = 'Welcome to the VA virtual agent.';
    const textField = '.webchat__send-box-text-box__input';
    const actualResponse =
      "Learn how GI Bill benefits work and explore your options to pay for school or training. You may qualify for VA GI Bill benefits if you're a Veteran, service member, or the family member of a Veteran or service member.";
    const buttonYes = '//span[text()="Yes"]';
    const buttonNo = '//span[text()="No"]';
    const buttonNoThanks = '//span[text()="No, thanks"]';
    const response = '//p[contains(text(),"Learn")]';
    const rating4 = '//img[@alt="4"]';
    const buttonTryAgain = '//span[text()="Try again"]';
    const buttonSpeakWithAnAgent = '//span[text()="Speak with an agent"]';

    cy.visit(manifest.rootUrl);
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
    cy.get('span[text="Yes"]', { timeout: 60000 });
    // cy.xpath(buttonYes, { timeout: 60000 });
    // cy.xpath(response)
    //   .invoke('text')
    //   .should('eq', actualResponse);
    //
    // // When user selects Yes
    // cy.xpath(buttonYes).should('be.visible');
    // cy.xpath(buttonNo).should('be.visible');
    // cy.xpath(buttonYes).click();
    // cy.xpath(rating4, { timeout: 60000 });
    // cy.xpath(rating4).click();
    // cy.xpath(buttonYes).should('be.visible');
    // cy.xpath(buttonNoThanks).should('be.visible');
    // cy.xpath(buttonNoThanks).click();
    //
    // cy.wait(3000);
    // // When user selects No
    // cy.get(textField)
    //   .type('Covid Vaccine')
    //   .type('{enter}');
    // cy.xpath(buttonNo, { timeout: 60000 });
    // cy.xpath(buttonNo).click();
    // cy.xpath(buttonTryAgain, { timeout: 60000 });
    // cy.xpath(buttonTryAgain).should('be.visible');
    // cy.xpath(buttonSpeakWithAnAgent).should('be.visible');
    // cy.xpath(buttonTryAgain).click();
  });
});
