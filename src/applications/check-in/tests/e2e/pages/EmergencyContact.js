import Timeouts from 'platform/testing/e2e/timeouts';

class EmergencyContact {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Is this your current emergency contact?');
  };

  validateDemographicsFields = () => {
    cy.get("dl[data-testid='demographics-fields']")
      .find('dt:nth-of-type(1)')
      .should('have.text', 'Name')
      .next()
      .next()
      .should('have.text', 'Relationship')
      .next()
      .next()
      .should('have.text', 'Address')
      .next()
      .next()
      .should('have.text', 'Phone')
      .next()
      .next()
      .should('have.text', 'Work phone');
  };

  validateDemographicData = ({
    address = '123 fake streetAlbuquerque, New Mexico 87102',
    phone = '555-867-5309',
    relationship = 'EXTENDED FAMILY MEMBER',
    workPhone = 'Not available',
    name = 'Bugs Bunny',
  } = {}) => {
    cy.get("dl[data-testid='demographics-fields']")
      .find('dd:nth-of-type(1)')
      .should('have.text', name)
      .next()
      .next()
      .should('have.text', relationship)
      .next()
      .next()
      .should('have.text', address)
      .next()
      .next()
      .should('have.text', phone)
      .next()
      .next()
      .should('have.text', workPhone);
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`button[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new EmergencyContact();
