import Timeouts from 'platform/testing/e2e/timeouts';

class Demographics {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Is this your current contact information?');
  };

  validateSubTitle = () => {
    cy.get('.confirmable-page > p', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        'We can better follow up with you after your appointment when we have your current information.',
      );
  };

  validateDemographicsFields = (
    parentSelector = "ul[data-testid='demographics-fields']",
  ) => {
    cy.get(parentSelector)
      .find('li:nth-of-type(1)')
      .should('include.text', 'Mailing address')
      .next()
      .should('include.text', 'Home address')
      .next()
      .should('include.text', 'Home phone')
      .next()
      .should('include.text', 'Mobile phone')
      .next()
      .should('include.text', 'Work phone')
      .next()
      .should('include.text', 'Email address');
  };

  validateDemographicData = ({
    mailingAddress = '123 Turtle TrailTreetopper, Tennessee 10101',
    homeAddress = '445 Fine Finch Fairway, Apt 201Fairfence, Florida 44554',
    homePhone = '555-222-3333',
    mobilePhone = '555-333-4444',
    workPhone = '555-444-5555',
    email = 'fred.carter@mailbox.com',
  } = {}) => {
    cy.get("ul[data-testid='demographics-fields']")
      .find('li:nth-of-type(1)')
      .should('include.text', mailingAddress)
      .next()
      .should('include.text', homeAddress)
      .next()
      .should('include.text', homePhone)
      .next()
      .should('include.text', mobilePhone)
      .next()
      .should('include.text', workPhone)
      .next()
      .should('include.text', email);
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new Demographics();
