import Timeouts from 'platform/testing/e2e/timeouts';

class EmergencyContact {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Is this your current emergency contact?');
  };

  validateDemographicsFields = () => {
    cy.get("ul[data-testid='demographics-fields']")
      .find('li:nth-of-type(1)')
      .should('include.text', 'Name')
      .next()
      .should('include.text', 'Relationship')
      .next()
      .should('include.text', 'Address')
      .next()
      .should('include.text', 'Phone')
      .next()
      .should('include.text', 'Work phone');
  };

  validateDemographicData = ({
    address = '1233 8th StreetAlbuquerque, New Mexico 87102',
    phone = '555-867-5309',
    relationship = 'EXTENDED FAMILY MEMBER',
    workPhone = 'Not available',
    name = 'Star Garnet',
  } = {}) => {
    cy.get("ul[data-testid='demographics-fields']")
      .find('li:nth-of-type(1)')
      .should('include.text', name)
      .next()
      .should('include.text', relationship)
      .next()
      .should('include.text', address)
      .next()
      .should('include.text', phone)
      .next()
      .should('include.text', workPhone);
  };

  validateBackButton = () => {
    cy.get('a[data-testid="back-button"]')
      .should('have.text', 'Back to last screen')
      .should('have.attr', 'href')
      .and('contain', 'demographics');
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new EmergencyContact();
