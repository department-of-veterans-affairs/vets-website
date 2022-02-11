import Timeouts from 'platform/testing/e2e/timeouts';

class Demographics {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Is this your current contact information?');
  };

  validateSubTitle = () => {
    cy.get('.confirmable-page > p', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'have.text',
        'We can better follow up with you after your appointment when we have your current information.',
      );
  };

  validateDemographicsFields = (
    parentSelector = "dl[data-testid='demographics-fields']",
  ) => {
    cy.get(parentSelector)
      .find('dt:nth-of-type(1)')
      .should('have.text', 'Mailing address')
      .next()
      .next()
      .should('have.text', 'Home address')
      .next()
      .next()
      .should('have.text', 'Home phone')
      .next()
      .next()
      .should('have.text', 'Mobile phone')
      .next()
      .next()
      .should('have.text', 'Work phone')
      .next()
      .next()
      .should('have.text', 'Email address');
  };

  validateDemographicData = ({
    mailingAddress = '123 Turtle TrailTreetopper, Tennessee 10101',
    homeAddress = '445 Fine Finch Fairway, Apt 201Fairfence, Florida 44554',
    homePhone = '555-222-3333',
    mobilePhone = '555-333-4444',
    workPhone = '555-444-5555',
    email = 'kermit.frog@sesameenterprises.us',
  } = {}) => {
    cy.get("dl[data-testid='demographics-fields']")
      .find('dd:nth-of-type(1)')
      .should('have.text', mailingAddress)
      .next()
      .next()
      .should('have.text', homeAddress)
      .next()
      .next()
      .should('have.text', homePhone)
      .next()
      .next()
      .should('have.text', mobilePhone)
      .next()
      .next()
      .should('have.text', workPhone)
      .next()
      .next()
      .should('have.text', email);
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`button[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new Demographics();
